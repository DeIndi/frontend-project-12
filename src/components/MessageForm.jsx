import { Field, Form, Formik } from 'formik';
import filter from 'leo-profanity';
import React from 'react';
import { useTranslation } from 'react-i18next';

const MessageForm = ({
  initialValues, API, currentChannel, username,
}) => {
  const { t } = useTranslation();
  return (
    <div className="mt-auto px-5 py-3">
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { resetForm }) => {
          await API.createMessage({
            body: filter.clean(values.body),
            channelId: currentChannel.id,
            username,
          });
          resetForm();
        }}
      >
        { (formik) => (
          <Form onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
            <div className="input-group has-validation">
              <Field
                type="text"
                name="body"
                aria-label={t('channelList.newMessage')}
                placeholder={t('channelList.inputMessage')}
                className="border-0 p-0 ps-2 form-control"
              />
              <button type="submit" className="btn btn-group-vertical">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                  />
                </svg>
                <span className="visually-hidden">{ t('modal.send') }</span>
              </button>
            </div>
          </Form>
        ) }
      </Formik>
    </div>
  );
};

export default MessageForm;
