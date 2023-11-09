import { ParentComponent } from 'solid-js';
import './Button.scss';

interface ButtonProps {
  handleClick: () => void;
  class?: string;
  disabled?: boolean;
}

const Button: ParentComponent<ButtonProps> = (props) => {
  return (
    <button class={[props.class, 'button'].join(' ')} onclick={props.handleClick} disabled={props.disabled}>
      {props.children}
    </button>
  );
};

export default Button;
