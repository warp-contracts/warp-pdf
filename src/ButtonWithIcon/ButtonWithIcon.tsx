import { ParentComponent } from 'solid-js';
import './ButtonWithIcon.scss';

interface ButtonWithIconProps {
  handleClick: () => void;
  icon: string;
  class?: string;
}

const ButtonWithIcon: ParentComponent<ButtonWithIconProps> = (props) => {
  return (
    <button class={[props.class, 'button__with-icon d-flex'].join(' ')} onclick={props.handleClick}>
      <img height={20} class='button__with-icon__icon' src={props.icon} />
      {props.children}
    </button>
  );
};

export default ButtonWithIcon;
