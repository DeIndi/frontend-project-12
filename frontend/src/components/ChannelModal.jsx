import { FormControl, Form, Button, Modal } from "react-bootstrap"
import {useFormik} from "formik";
import { useDispatch } from "react-redux";
import { useAuth, useSocketAPI } from "../hooks";
import {actions as modalsActions} from "../slices/modalsSlice";

const AddChannelModal = () => {
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
            socketAPI.createChannel({name: values.name});
            dispatch(modalsActions.changeCurrentModal(''));
            formik.setSubmitting(false);
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
    const onClose = () => {

    }
    const formik = useFormik({
        initialValues : {
            name: '',
        },
        onSubmit: values => {
            socketAPI.renameChannel({id, name: values.name });
            formik.setSubmitting(false);
            dispatch(modalsActions.changeCurrentModal(''));
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

export { AddChannelModal, RenameChannelModal };