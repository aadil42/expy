import _ from 'underscore';
import React, {useState, useEffect, useCallback} from 'react';
import {View} from 'react-native';
import lodashGet from 'lodash/get';
import ScreenWrapper from '../../../../components/ScreenWrapper';
import HeaderWithBackButton from '../../../../components/HeaderWithBackButton';
import withLocalize, {withLocalizePropTypes} from '../../../../components/withLocalize';
import Form from '../../../../components/Form';
import ONYXKEYS from '../../../../ONYXKEYS';
import CONST from '../../../../CONST';
import * as ValidationUtils from '../../../../libs/ValidationUtils';
import TextInput from '../../../../components/TextInput';
import styles from '../../../../styles/styles';
import * as PersonalDetails from '../../../../libs/actions/PersonalDetails';
import compose from '../../../../libs/compose';
import Navigation from '../../../../libs/Navigation/Navigation';
import ROUTES from '../../../../ROUTES';
import FullscreenLoadingIndicator from '../../../../components/FullscreenLoadingIndicator';
import withPrivatePersonalDetails, {
    // eslint-disable-next-line import/named
    withPrivatePersonalDetailsDefaultProps,
    withPrivatePersonalDetailsPropTypes,
} from '../../../../components/withPrivatePersonalDetails';

const propTypes = {
    /* Onyx Props */
    ...withPrivatePersonalDetailsPropTypes,
    ...withLocalizePropTypes,
};

const defaultProps = {
    ...withPrivatePersonalDetailsDefaultProps,
};

const updateLegalName = (values) => {
    PersonalDetails.updateLegalName(values.legalFirstName.trim(), values.legalLastName.trim());
};

function LegalNamePage({translate, privatePersonalDetails}) {
    const [legalFirstName, setLegalFirstName] = useState(lodashGet(privatePersonalDetails, 'legalFirstName', ''));
    const [legalLastName, setLegalLastName] = useState(lodashGet(privatePersonalDetails, 'legalLastName', ''));

    useEffect(() => {
        setLegalFirstName(lodashGet(privatePersonalDetails, 'legalFirstName', ''));
        setLegalLastName(lodashGet(privatePersonalDetails, 'legalLastName', ''));
    }, [privatePersonalDetails, privatePersonalDetails.legalFirstName, privatePersonalDetails.legalLastName]);

    const validate = useCallback((values) => {
        const errors = {};

        if (!ValidationUtils.isValidLegalName(values.legalFirstName)) {
            errors.legalFirstName = 'privatePersonalDetails.error.hasInvalidCharacter';
        } else if (_.isEmpty(values.legalFirstName)) {
            errors.legalFirstName = 'common.error.fieldRequired';
        }

        if (!ValidationUtils.isValidLegalName(values.legalLastName)) {
            errors.legalLastName = 'privatePersonalDetails.error.hasInvalidCharacter';
        } else if (_.isEmpty(values.legalLastName)) {
            errors.legalLastName = 'common.error.fieldRequired';
        }

        return errors;
    }, []);

    if (privatePersonalDetails.isLoading) {
        return <FullscreenLoadingIndicator />;
    }

    return (
        <ScreenWrapper includeSafeAreaPaddingBottom={false}>
            <HeaderWithBackButton
                title={translate('privatePersonalDetails.legalName')}
                onBackButtonPress={() => Navigation.goBack(ROUTES.SETTINGS_PERSONAL_DETAILS)}
            />
            <Form
                style={[styles.flexGrow1, styles.ph5]}
                formID={ONYXKEYS.FORMS.LEGAL_NAME_FORM}
                validate={validate}
                onSubmit={updateLegalName}
                submitButtonText={translate('common.save')}
                enabledWhenOffline
            >
                <View style={[styles.mb4]}>
                    <TextInput
                        inputID="legalFirstName"
                        name="lfname"
                        label={translate('privatePersonalDetails.legalFirstName')}
                        accessibilityLabel={translate('privatePersonalDetails.legalFirstName')}
                        accessibilityRole={CONST.ACCESSIBILITY_ROLE.TEXT}
                        value={legalFirstName}
                        onValueChange={setLegalFirstName}
                        maxLength={CONST.DISPLAY_NAME.MAX_LENGTH}
                    />
                </View>
                <View>
                    <TextInput
                        inputID="legalLastName"
                        name="llname"
                        label={translate('privatePersonalDetails.legalLastName')}
                        accessibilityLabel={translate('privatePersonalDetails.legalLastName')}
                        accessibilityRole={CONST.ACCESSIBILITY_ROLE.TEXT}
                        value={legalLastName}
                        onValueChange={setLegalLastName}
                        maxLength={CONST.DISPLAY_NAME.MAX_LENGTH}
                    />
                </View>
            </Form>
        </ScreenWrapper>
    );
}

LegalNamePage.propTypes = propTypes;
LegalNamePage.defaultProps = defaultProps;

export default compose(withLocalize, withPrivatePersonalDetails)(LegalNamePage);
