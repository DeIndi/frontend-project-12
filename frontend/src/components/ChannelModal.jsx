import { FormControl, Form, Button, Modal } from "react-bootstrap"
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import { useAuth, useSocketAPI } from "../hooks";
import {actions as modalsActions} from "../slices/modalsSlice";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import {actions as messagesActions} from "../slices/messagesSlice";

const DispatchModal = () => {
    const currentModal = useSelector(state => state.modals.currentModal);
    let modalData = useSelector(state => state.modals.modalData);
    const modalComponents = {
        add: AddChannelModal,
        rename: RenameChannelModal,
        remove: RemoveChannelModal,
    };

    const ModalComponent = modalComponents[currentModal];

    return ModalComponent ? <ModalComponent modalData={modalData} /> : null;
}

const AddChannelModal = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const socketAPI = useSocketAPI();
    const onClose = () => {
        dispatch(modalsActions.closeModal());
    }
    const formik = useFormik({
        initialValues : {
            name: '',
        },
        onSubmit: values => {
            try {
                console.log('Channel added');
                socketAPI.createChannel({name: filter.clean(values.name)});
                toast.success(t('channelModal.channelAddSuccess'));
                dispatch(modalsActions.closeModal());
                formik.setSubmitting(false);
            }
            catch {
                console.log('Channel adding error');
                toast.error(t('channelModal.channelAddFail'));
            }

        },
    });
    return (
        <>
            <Modal show={true} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>Добавить канал</Modal.Title>
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
                            disabled={ formik.isSubmitting }
                            onChange={ formik.handleChange }
                            name="name"
                            id="name"
                        />
                        <label className="visually-hidden" htmlFor="name">{ 'Название канала' }</label>
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
}

const RenameChannelModal = ({modalData}) => {
    const { id } = modalData;
    const dispatch = useDispatch();
    const socketAPI = useSocketAPI();
    const { t } = useTranslation();
    const onClose = () => {
        dispatch(modalsActions.closeModal());
    }
    const formik = useFormik({
        initialValues : {
            name: '',
        },
        onSubmit: values => {
            try {
                console.log('Channel renamed');
                socketAPI.renameChannel({id, name: filter.clean(values.name) });
                toast.success(`${t('channelModal.channelRenameSuccess')}, ${filter.clean(values.name)}`);
                formik.setSubmitting(false);
                dispatch(modalsActions.closeModal());
            }
            catch (error) {
                console.log('Channel renaming error');
                toast.error(`${t('channelModal.channelRenameFail')}, ${filter.clean(values.name)}`);
            }
        },
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
                            disabled={ formik.isSubmitting }
                            onChange={ formik.handleChange }
                            name="name"
                            id="name"
                        />
                        <label className="visually-hidden" htmlFor="name">{ 'Название канала' }</label>
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
}

const RemoveChannelModal = ({modalData}) => {
    const dispatch = useDispatch();
    const socketAPI = useSocketAPI();
    const { t } = useTranslation();
    const { id, channel } = modalData;
    const onClose = () => {
        dispatch(modalsActions.closeModal());
    }
    const formik = useFormik({
        initialValues : {
            name: '',
        },
        onSubmit: values => {
            console.log('channel: ', channel);
            if (channel.removable) {
                try {
                    socketAPI.removeChannel(id);
                    toast.success(t('channelModal.channelRemoveSuccess'));
                    formik.setSubmitting(false);
                    dispatch(modalsActions.closeModal());
                }
                catch (e) {
                    toast.error(t('channelModal.channelRemoveFail'));
                }
            }
        },
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
}

export { DispatchModal, AddChannelModal, RenameChannelModal };