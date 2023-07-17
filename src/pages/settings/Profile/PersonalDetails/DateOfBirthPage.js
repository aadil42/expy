import moment from 'moment';
import React, {useState, useEffect, useCallback} from 'react';
import CONST from '../../../../CONST';
import ONYXKEYS from '../../../../ONYXKEYS';
import ROUTES from '../../../../ROUTES';
import Form from '../../../../components/Form';
import HeaderWithBackButton from '../../../../components/HeaderWithBackButton';
import NewDatePicker from '../../../../components/NewDatePicker';
import ScreenWrapper from '../../../../components/ScreenWrapper';
import withLocalize, {withLocalizePropTypes} from '../../../../components/withLocalize';
import Navigation from '../../../../libs/Navigation/Navigation';
import * as ValidationUtils from '../../../../libs/ValidationUtils';
import * as PersonalDetails from '../../../../libs/actions/PersonalDetails';
import compose from '../../../../libs/compose';
import styles from '../../../../styles/styles';
import withPrivatePersonalDetails, {withPrivatePersonalDetailsDefaultProps, withPrivatePersonalDetailsPropTypes} from '../../../../components/withPrivatePersonalDetails';
import FullscreenLoadingIndicator from '../../../../components/FullscreenLoadingIndicator';

const propTypes = {
    /* Onyx Props */
    ...withPrivatePersonalDetailsPropTypes,
    ...withLocalizePropTypes,
};

const defaultProps = {
    ...withPrivatePersonalDetailsDefaultProps,
};

function DateOfBirthPage({translate, privatePersonalDetails}) {
    /**
     * @param {Object} values
     * @param {String} values.dob - date of birth
     * @returns {Object} - An object containing the errors for each inputID
     */
    const validate = useCallback((values) => {
        const errors = {};
        const minimumAge = CONST.DATE_BIRTH.MIN_AGE;
        const maximumAge = CONST.DATE_BIRTH.MAX_AGE;

        if (!values.dob || !ValidationUtils.isValidDate(values.dob)) {
            errors.dob = 'common.error.fieldRequired';
        }
        const dateError = ValidationUtils.getAgeRequirementError(values.dob, minimumAge, maximumAge);
        if (dateError) {
            errors.dob = dateError;
        }

        return errors;
    }, []);

    const [dob, setDob] = useState(privatePersonalDetails.dob || '');

    useEffect(() => {
        setDob(privatePersonalDetails.dob);
    }, [privatePersonalDetails.dob]);

    if (privatePersonalDetails.isLoading) {
        return <FullscreenLoadingIndicator />;
    }

    return (
        <ScreenWrapper includeSafeAreaPaddingBottom={false}>
            <HeaderWithBackButton
                title={translate('common.dob')}
                onBackButtonPress={() => Navigation.goBack(ROUTES.SETTINGS_PERSONAL_DETAILS)}
            />
            <Form
                style={[styles.flexGrow1, styles.ph5]}
                formID={ONYXKEYS.FORMS.DATE_OF_BIRTH_FORM}
                validate={validate}
                onSubmit={PersonalDetails.updateDateOfBirth}
                submitButtonText={translate('common.save')}
                enabledWhenOffline
            >
                <NewDatePicker
                    inputID="dob"
                    label={translate('common.date')}
                    value={dob}
                    onValueChange={setDob}
                    minDate={moment().subtract(CONST.DATE_BIRTH.MAX_AGE, 'years').toDate()}
                    maxDate={moment().subtract(CONST.DATE_BIRTH.MIN_AGE, 'years').toDate()}
                />
            </Form>
        </ScreenWrapper>
    );
}

DateOfBirthPage.propTypes = propTypes;
DateOfBirthPage.defaultProps = defaultProps;
DateOfBirthPage.displayName = 'DateOfBirthPage';

export default compose(withLocalize, withPrivatePersonalDetails)(DateOfBirthPage);
