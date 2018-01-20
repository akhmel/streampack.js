export default function StreampackComponent (reakt) {
  return class Component extends reakt.Component {
    constructor(props) {
      super(props);
      this.hashFunction = this.hashFunction.bind(this);
    }

    stringifyInd(ind) {
      return `${ind}`.split('').map((i)=>{
        return String.fromCharCode(97 + parseInt(i));
      }).join('');
    }

    hashFunction(ind) {
      const { props: { _childIndex }} = this;
      return `${this.stringifyInd(_childIndex)}-${this.stringifyInd(ind)}`;
    }

    recursiveSid(ch, i) {
      let subchld; i++;
      if (ch.props.children instanceof Array) {
        subchld = ch.props.children.map((el, elInd) => {
          return this.recursiveSid(el, elInd+i);
        });
      } else if (ch.props.children instanceof Object) {
        subchld = this.recursiveSid(ch.props.children, i);
      } else {
        subchld = ch.props.children;
      }
      return reakt.cloneElement(
        ch, {
          sid: this.hashFunction(i),
          key: ch.key || this.hashFunction(i),
          children: subchld
        }
      );
    }

    render() {
      const renderRes = this._render(); const index = 0;
      if (renderRes.props.children instanceof Array) {
        return this.recursiveSid(renderRes, index);
      }
      return reakt.cloneElement(renderRes, { sid: this.hashFunction(index) });
    }
  }
}
