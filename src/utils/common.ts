// 组件的约束，接口，其他所有接口必须实现这个接口
interface Icomponent {
  tempContainer: HTMLElement;
  init : () => void;
  template : () => void;
  handle : () => void;
}
export default Icomponent