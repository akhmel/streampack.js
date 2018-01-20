export default function StreampackComponent (reakt) {
  return class Component extends reakt.Component {
    setState(newState) {
      const { _childIndex, _onSetState } = this.props.streampack;
      let statePayload = {}; statePayload[_childIndex] = newState;
      _onSetState(statePayload);
    }

    _stringifyInd(ind) {
      return `${ind}`.split('').map((i)=>{
        return String.fromCharCode(97 + parseInt(i));
      }).join('');
    }

    // TODO: consider element content, not only ind
    _hashFunction(ind) {
      const { _childIndex } = this.props.streampack;
      return `${this._stringifyInd(_childIndex)}-${this._stringifyInd(ind)}`;
    }

    _recursiveSid(ch, i) {
      let subchld; i++;
      const sid = this._hashFunction(i);
      if (ch.props.children instanceof Array) {
        subchld = ch.props.children.map((el, elInd) => {
          return this._recursiveSid(el, elInd+i);
        });
      } else if (ch.props.children instanceof Object) {
        subchld = this._recursiveSid(ch.props.children, i);
      } else {
        subchld = ch.props.children;
      }

      // TODO: add iterator on SUPPORTED_EVENTS
      if (ch.props.onClick) {
        this.eventsMap[sid] = this.eventsMap[sid] || {};
        this.eventsMap[sid].onClick = ch.props.onClick;
      }

      return reakt.cloneElement(
        ch, {
          sid: sid,
          key: ch.key || sid,
          children: subchld
        }
      );
    }

    _translateEventToHandler(eventName) {
      return {
        click: 'onClick'
      }[eventName]
    }

    render() {
      const { _event, _newState } = this.props.streampack;
      this.eventsMap = {};
      this.state = (_newState && Object.assign(this.state, _newState)) || this.state;
      this._hashFunction = this._hashFunction.bind(this);
      const renderRes = this.renderWithStreampack(); const index = 0; let finalOutput;
      if (renderRes.props.children instanceof Array) {
        finalOutput = this._recursiveSid(renderRes, index);
      } else {
        finalOutput = reakt.cloneElement(renderRes, { sid: this._hashFunction(index) });
      }

      if (_event) {
        if (this.eventsMap[_event.sid]) {
          if (this.eventsMap[_event.sid][this._translateEventToHandler(_event.event)] instanceof Function) {
            this.eventsMap[_event.sid][this._translateEventToHandler(_event.event)]();
          }
        }
      }

      return finalOutput;
    }
  }
}
