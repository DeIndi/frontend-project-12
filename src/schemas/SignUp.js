import * as yup from 'yup';

const schema = yup.object({
  username: yup
    .string()
    .min(3, 'signUp.usernameConstraints')
    .max(20, 'signUp.usernameConstraints')
    .required('signUp.requiredField'),
  password: yup
    .string()
    .min(6, 'signUp.passMin')
    .required('signUp.requiredField'),
  passwordConfirmation: yup.string().test(
    'passwords-match',
    'signUp.passMatchUp',
    (value) => value === this.parent.password,
  ),
});

export default schema;
