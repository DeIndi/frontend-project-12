import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import filter from 'leo-profanity';
import { useAPI } from '../hooks';
import { actions as modalsActions } from '../slices/modalsSlice';
import { actions as channelsActions } from '../slices/channelsSlice';
import 'react-toastify/dist/ReactToastify.css';
import { getChannelById, getChannelsNames, getCurrentModal } from '../selectors/selectors';

const schema = (channelsNames) => yup.object({
  name: yup
    .string()
    .trim()
    .min(3, 'signUp.usernameConstraints')
    .max(20, 'signUp.usernameConstraints')
    .required('signUp.requiredField')
    .notOneOf(channelsNames, 'ChannelModal.channelNotUnique'),
});

const AddChannelModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const API = useAPI();
  const channels = useSelector(getChannelsNames);
  const [addFailed, setAddFailed] = useState(false);
  const onClose = () => {
    dispatch(modalsActions.closeModal());
  };
  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: schema(channels),
    onSubmit: async (values) => {
      try {
        await formik.validateForm();
      } catch (errors) {
        setAddFailed(true);
        return;
      }
      try {
        const data = await API.createChannel({ name: filter.clean(values.name) });
        dispatch(channelsActions.updateCurrentChannelId(data.id));
        toast.success(t('channelModal.channelAddSuccess'));
        dispatch(modalsActions.closeModal());
        formik.setSubmitting(false);
        setAddFailed(false);
      } catch {
        setAddFailed(true);
        toast.error(t('channelModal.channelAddFail'));
      }
    },
  });
  return (
    <>
      <Modal show onHide={onClose}>
        <Modal.Header>
          <Modal.Title>{ t('channelModal.add') }</Modal.Title>
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
                disabled={formik.isSubmitting}
                onChange={formik.handleChange}
                autoFocus
                name="name"
                id="name"
              />
              <Form.Label
                className="visually-hidden"
                htmlFor="name"
              >
                { t('channelModal.channelName') }
              </Form.Label>
              <div className="d-flex justify-content-end">
                <Button
                  className="me-2"
                  variant="secondary"
                  type="button"
                  onClick={onClose}
                >
                  { t('modal.close') }
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  { t('modal.send') }
                </Button>
              </div>
              <Form.Control.Feedback type="invalid" tooltip placement="right">
                { t(formik.errors.name) }
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
  const API = useAPI();
  const { t } = useTranslation();
  const [renameFailed, setRenameFailed] = useState(false);
  const channelNames = useSelector(getChannelsNames);
  const channel = useSelector(getChannelById(id));
  const onClose = () => {
    dispatch(modalsActions.closeModal());
  };
  const formik = useFormik({
    initialValues: {
      name: channel.name,
    },
    validationSchema: schema(channelNames),
    onSubmit: async (values) => {
      try {
        await formik.validateForm();
      } catch (errors) {
        setRenameFailed(true);
        return;
      }
      try {
        await API.renameChannel({ id, name: filter.clean(values.name) });
        toast.success(`${t('channelModal.channelRenameSuccess')}, ${filter.clean(values.name)}`);
        formik.setSubmitting(false);
        await dispatch(modalsActions.closeModal());
        setRenameFailed(false);
      } catch (error) {
        toast.error(`${t('channelModal.channelRenameFail')}, ${filter.clean(values.name)}`);
        setRenameFailed(true);
      }
    },
  });
  return (
    <>
      <Modal show onHide={onClose}>
        <Modal.Header>
          <Modal.Title>{ t('channelModal.rename') }</Modal.Title>
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
                autoFocus
                name="name"
                id="name"
              />
              <Form.Label className="visually-hidden" htmlFor="name">{ t('channelModal.channelName') }</Form.Label>
              <div className="d-flex justify-content-end">
                <Button
                  className="me-2"
                  variant="secondary"
                  type="button"
                  onClick={onClose}
                >
                  { t('modal.close') }
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  { t('modal.send') }
                </Button>
              </div>
              <Form.Control.Feedback type="invalid" tooltip placement="right">
                { t(formik.errors.name) }
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
  const API = useAPI();
  const { t } = useTranslation();
  const { id } = modalData;
  const channel = useSelector(getChannelById(id));
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
          await API.removeChannel({ id });
          toast.success(t('channelModal.channelRemoveSuccess'));
          formik.setSubmitting(false);
          dispatch(channelsActions.updateCurrentChannelId(1));
          await dispatch(modalsActions.closeModal());
        } catch (e) {
          toast.error(t('channelModal.channelRemoveFail'));
        }
      }
    },
  });
  return (
    <>
      <Modal show onHide={onClose}>
        <Modal.Header>
          <Modal.Title>{ t('channelModal.remove') }</Modal.Title>
          <Button
            variant="close"
            type="button"
            onClick={onClose}
            aria-label="Close"
            data-bs-dismiss="modal"
          />
        </Modal.Header>
        <Modal.Body>
          <p className="lead">{ t('modal.confirmation') }</p>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group>
              <div className="d-flex justify-content-end">
                <Button
                  className="me-2"
                  variant="secondary"
                  type="button"
                  onClick={onClose}
                >
                  { t('modal.close') }
                </Button>
                <Button
                  variant="danger"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  { t('modal.remove') }
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
  const currentModal = useSelector(getCurrentModal);
  const modalComponents = {
    add: AddChannelModal,
    rename: RenameChannelModal,
    remove: RemoveChannelModal,
  };

  const ModalComponent = modalComponents[currentModal.type];

  return ModalComponent ? <ModalComponent modalData={currentModal.data} /> : null;
};
export { DispatchModal, AddChannelModal, RenameChannelModal };
