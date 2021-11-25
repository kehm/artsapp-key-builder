import React, { useContext } from 'react';
import LanguageContext from '../../../context/LanguageContext';
import formatDate from '../../../utils/format-date';

/**
 * Render key info list
 */
const KeyInfoList = ({ keyInfo }) => {
    const { language } = useContext(LanguageContext);
    const createdAt = keyInfo.created_at ? formatDate(keyInfo.created_at, true) : undefined;
    const modified = keyInfo.updated_at ? formatDate(keyInfo.updated_at) : undefined;

    return (
        <>
            <h2 className="mb-4 mt-8">{language.dictionary.keyInfo}</h2>
            <dl className="mb-8">
                {modified && modified !== createdAt && (
                    <>
                        <dt className="float-left w-32 font-bold text-right mr-6 tracking-wide">
                            {language.dictionary.labelModified}
                        </dt>
                        <dd>{modified}</dd>
                    </>
                )}
                {createdAt && (
                    <>
                        <dt className="float-left w-32 font-bold text-right mr-6 tracking-wide">
                            {language.dictionary.created}
                        </dt>
                        <dd>{createdAt}</dd>
                    </>
                )}
                {keyInfo.status && (
                    <>
                        <dt className="float-left w-32 font-bold text-right mr-6 tracking-wide">
                            {language.dictionary.labelStatus}
                            :
                        </dt>
                        <dd>
                            {keyInfo.status.charAt(0).toUpperCase()
                                + keyInfo.status.slice(1).toLowerCase()}
                        </dd>
                    </>
                )}
                {keyInfo.version && (
                    <>
                        <dt className="float-left w-32 font-bold text-right mr-6 tracking-wide">
                            {language.dictionary.labelVersion}
                        </dt>
                        <dd>{keyInfo.version}</dd>
                    </>
                )}
            </dl>
            <h2 className="my-4">{language.dictionary.labelOwner}</h2>
            <dl>
                {keyInfo.artsapp_user && (
                    <>
                        <dt className="float-left w-32 font-bold text-right mr-6 tracking-wide">
                            {language.dictionary.labelCreatedBy}
                        </dt>
                        <dd>{keyInfo.artsapp_user.name}</dd>
                    </>
                )}
                {keyInfo.workgroup && keyInfo.workgroup.name && (
                    <>
                        <dt className="float-left w-32 font-bold text-right mr-6 tracking-wide">
                            {language.dictionary.labelWorkgroup}
                            :
                        </dt>
                        <dd>{keyInfo.workgroup.name}</dd>
                    </>
                )}
                {keyInfo.workgroup && keyInfo.workgroup.organization
                    && keyInfo.workgroup.organization.organization_info && (
                        <>
                            <dt className="float-left w-32 font-bold text-right mr-6 tracking-wide">
                                {language.dictionary.labelOrganization}
                            </dt>
                            <dd>{keyInfo.workgroup.organization.organization_info.fullName}</dd>
                        </>
                    )}
            </dl>
        </>
    );
};

export default KeyInfoList;
