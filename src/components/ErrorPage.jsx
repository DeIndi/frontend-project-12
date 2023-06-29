import React from 'react';
import { useRouteError } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ErrorPage() {
  const error = useRouteError();
  const { t } = useTranslation();
  console.error(error);

  return (
    <div id="error-page">
      <h1>{ error.statusText }</h1>
      <p>{t('errors.errorGeneral')}</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
