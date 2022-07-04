import PropTypes from 'prop-types';
// form
import { FormProvider as Form } from 'react-hook-form';

// mui
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

FormProvider.propTypes = {
  children: PropTypes.node.isRequired,
  methods: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
};

const StyledForm = styled('form')(() => ({
  width: '-webkit-fill-available',
}));

export default function FormProvider({ children, onSubmit, methods }) {
  return (
    <Form {...methods}>
      <StyledForm onSubmit={onSubmit}>{children}</StyledForm>
    </Form>
  );
}
