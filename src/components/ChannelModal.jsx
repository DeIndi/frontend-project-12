import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import filter from 'leo-profanity';
import { useSocketAPI } from '../hooks';
import { actions as modalsActions } from '../slices/modalsSlice';
import 'react-toastify/dist/ReactToastify.css';

const schema = (channels) => yup.object({
  name: yup
    .string()
    .min(3, 'signUp.usernameConstraints')
    .max(20, 'signUp.usernameConstraints')
    .required('signUp.requiredField')
    .notOneOf(channels, 'ChannelModal.channelNotUnique'),
});

const AddChannelModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const socketAPI = useSocketAPI();
  const channels = useSelector((state) => state.channels.entities.map((channel) => channel.name));
  console.log('channels: ', channels);
  const [addFailed, setAddFailed] = useState(false);
  const onClose = () => {
    dispatch(modalsActions.closeModal());
  };
  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values) => {
      try {
        await formik.validateForm();
      } catch (errors) {
        setAddFailed(true);
        return;
      }
      try {
        console.log('Channel added');
        socketAPI.createChannel({ name: filter.clean(values.name) });
        toast.success(t('channelModal.channelAddSuccess'));
        dispatch(modalsActions.closeModal());
        formik.setSubmitting(false);
        setAddFailed(false);
      } catch {
        console.log('Channel adding error');
        setAddFailed(true);
        toast.error(t('channelModal.channelAddFail'));
      }
    },
    validationSchema: schema(channels),
  });
  return (
        <>
            <Modal show={true} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>{t('channelModal.add')}</Modal.Title>
                <Button
                    variant="close"
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    data-bs-dismiss="modal"
                />
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={formik.handleSubmit}>
                    <Form.Group>
                        <Form.Control
                            className="mb-2"
                            isInvalid={addFailed}
                            disabled={ formik.isSubmitting }
                            onChange={ formik.handleChange }
                            autoFocus={true}
                            name="name"
                            id="name"
                        />
                        <Form.Label
                          className="visually-hidden"
                          htmlFor="name"
                        >
                          {t('channelModal.channelName')}
                        </Form.Label>
                        <div className="d-flex justify-content-end">
                            <Button
                                className="me-2"
                                variant="secondary"
                                type="button"
                                onClick={onClose}
                            >
                                {t('modal.close')}
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={formik.isSubmitting}
                            >
                                {t('modal.send')}
                            </Button>
                        </div>
                      <Form.Control.Feedback type="invalid" tooltip placement="right">
                        {t(formik.errors.name)}
                      </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            </Modal>
        </>
  );
};

const RenameChannelModal = ({ modalData }) => {
  const { id } = modalData;
  const dispatch = useDispatch();
  const socketAPI = useSocketAPI();
  const { t } = useTranslation();
  const [renameFailed, setRenameFailed] = useState(false);
  const channels = useSelector((state) => state.channels.entities.map((channel) => channel.name));
  const onClose = () => {
    dispatch(modalsActions.closeModal());
  };
  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values) => {
      try {
        await formik.validateForm();
      } catch (errors) {
        setRenameFailed(true);
        return;
      }
      try {
        console.log('Channel renamed');
        socketAPI.renameChannel({ id, name: filter.clean(values.name) });
        toast.success(`${t('channelModal.channelRenameSuccess')}, ${filter.clean(values.name)}`);
        formik.setSubmitting(false);
        dispatch(modalsActions.closeModal());
        setRenameFailed(false);
      } catch (error) {
        console.log('Channel renaming error');
        toast.error(`${t('channelModal.channelRenameFail')}, ${filter.clean(values.name)}`);
        setRenameFailed(true);
      }
    },
    validationSchema: schema(channels),
  });
  return (
        <>
            <Modal show={true} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>{t('channelModal.rename')}</Modal.Title>
                <Button
                    variant="close"
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    data-bs-dismiss="modal"
                />
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={formik.handleSubmit}>
                    <Form.Group>
                        <Form.Control
                            className="mb-2"
                            isInvalid={renameFailed}
                            disabled={formik.isSubmitting}
                            onChange={formik.handleChange}
                            autoFocus={true}
                            name="name"
                            id="name"
                        />
                        <Form.Label className="visually-hidden" htmlFor="name">{t('channelModal.channelName')}</Form.Label>
                        <div className="d-flex justify-content-end">
                            <Button
                                className="me-2"
                                variant="secondary"
                                type="button"
                                onClick={onClose}
                            >
                                {t('modal.close')}
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={formik.isSubmitting}
                            >
                                {t('modal.send')}
                            </Button>
                        </div>
                      <Form.Control.Feedback type="invalid" tooltip placement="right">
                        {t(formik.errors.name)}
                      </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            </Modal>
        </>
  );
};

const RemoveChannelModal = ({ modalData }) => {
  const dispatch = useDispatch();
  const socketAPI = useSocketAPI();
  const { t } = useTranslation();
  const { id, channel } = modalData;
  const onClose = () => {
    dispatch(modalsActions.closeModal());
  };
  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async () => {
      if (channel.removable) {
        try {
          socketAPI.removeChannel(id);
          toast.success(t('channelModal.channelRemoveSuccess'));
          formik.setSubmitting(false);
          dispatch(modalsActions.closeModal());
        } catch (e) {
          toast.error(t('channelModal.channelRemoveFail'));
        }
      }
    },
  });
  return (
        <>
            <Modal show={true} onHide={onClose}>
                <Modal.Header>
                    <Modal.Title>{t('channelModal.remove')}</Modal.Title>
                    <Button
                        variant="close"
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        data-bs-dismiss="modal"
                    />
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group>
                            <div className="d-flex justify-content-end">
                                <Button
                                    className="me-2"
                                    variant="secondary"
                                    type="button"
                                    onClick={onClose}
                                >
                                    {t('modal.close')}
                                </Button>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                >
                                    {t('modal.send')}
                                </Button>
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
  );
};

const DispatchModal = () => {
  const currentModal = useSelector((state) => state.modals.currentModal);
  const modalData = useSelector((state) => state.modals.modalData);
  const modalComponents = {
    add: AddChannelModal,
    rename: RenameChannelModal,
    remove: RemoveChannelModal,
  };

  const ModalComponent = modalComponents[currentModal];

  return ModalComponent ? <ModalComponent modalData={modalData} /> : null;
};
export { DispatchModal, AddChannelModal, RenameChannelModal };
