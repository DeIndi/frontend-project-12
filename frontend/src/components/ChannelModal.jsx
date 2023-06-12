import { FormControl, Form, Button, Modal } from "react-bootstrap"
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import { useAuth, useSocketAPI } from "../hooks";
import {actions as modalsActions} from "../slices/modalsSlice";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';

const DispatchModal = () => {
    const currentModal = useSelector(state => state.modals.currentModal);
    //const {id, name} =  useSelector(state => state.channels.channelToRename);
    const {id, name} =  useSelector(state => state.modals.targetChannel);
    /*if (currentModal==='add'){
        return AddChannelModal();
    }
    if (currentModal==='rename'){
        return RenameChannelModal({id, name});
    }*/
    const modalComponents = {
        add: <AddChannelModal />,
        rename: <RenameChannelModal id={id} name={name} />
    };

    const ModalComponent = modalComponents[currentModal];

    return ModalComponent ? ModalComponent : null;
}

const AddChannelModal = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const socketAPI = useSocketAPI();
    const onClose = () => {
        dispatch(modalsActions.changeCurrentModal(''));
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
                dispatch(modalsActions.changeCurrentModal(''));
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
                                Закрыть
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={formik.isSubmitting}
                            >
                                Отправить
                            </Button>
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            </Modal>
        </>
    );
}

const RenameChannelModal = ({id, oldName}) => {
    const dispatch = useDispatch();
    const socketAPI = useSocketAPI();
    const { t } = useTranslation();
    const onClose = () => {

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
                dispatch(modalsActions.changeCurrentModal(''));
            }
            catch (error) {
                console.log('Channel renaming error');
                toast.error(`${t('channelModal.channelRenameFail')}, ${filter.clean(values.name)}`);
            }
        },
    });
    return (
        <>
            <Modal.Header>
                <Modal.Title>Переименовать канал {oldName}</Modal.Title>
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
                                Закрыть
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={formik.isSubmitting}
                            >
                                Отправить
                            </Button>
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </>
    );
}

export { DispatchModal, AddChannelModal, RenameChannelModal };