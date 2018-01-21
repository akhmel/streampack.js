import PropTypes from 'prop-types';

const contextTypes = {
  streampack: PropTypes.shape({
    _newState: PropTypes.object,
    _onSetState: PropTypes.func,
    _event: PropTypes.object
  })
};

export default function StreampackComponent (reakt) {
  return class Component extends reakt.Component {
    static contextTypes = contextTypes;
    setState(newState) {
      const { _onSetState } = this.context.streampack;
      const { streampack: { _componentSid } } = this.props;
      let statePayload = {}; statePayload[_componentSid] = newState;
      _onSetState(statePayload);
    }

    _stringifyInd(ind) {
      return `${ind}`.split('').map((i)=>{
        return String.fromCharCode(96 + parseInt(i));
      }).join('');
    }

    _hashFunction(ind) {
      const { streampack: { _componentSid } } = this.props;
      return `${_componentSid}-${this._stringifyInd(ind)}`;
    }

    _recursiveSid(ch, i) {
      let subchld; i++;
      if (ch.props) {
        if (ch.props.children instanceof Array) {
          subchld = ch.props.children.map((el, elInd) => {
            return this._recursiveSid(el, elInd+i);
          });
        } else if (ch.props.children instanceof Object) {
          subchld = this._recursiveSid(ch.props.children, i);
        } else if (ch.props) {
          subchld = ch.props.children;
        } else {
          subchld = ch
        }

        let propsPayload = {}; let sid;
        if (ch.type instanceof Function) {
          const { streampack } = this.props;
          propsPayload.streampack = {...streampack};
          this._subChildIndex++;
          propsPayload.streampack._componentSid += `#${this._stringifyInd(this._subChildIndex)}`
        } else {
          sid = this._hashFunction(i);
        }

        // TODO: add iterator on SUPPORTED_EVENTS
        if (ch.props.onClick) {
          this.eventsMap[sid] = this.eventsMap[sid] || {};
          this.eventsMap[sid].onClick = ch.props.onClick;
        }

        return reakt.cloneElement(ch, {
          ...propsPayload,
          sid: sid,
          key: ch.key || sid,
          children: subchld
        });
      } else {
        return ch;
      }
    }

    _translateEventToHandler(eventName) {
      return {
        click: 'onClick'
      }[eventName]
    }

    render() {
      const { _event, _onSetState, _appState } = this.context.streampack;
      const { streampack: { _componentSid } } = this.props;
      const newState = _appState[_componentSid];
      this.eventsMap = {};
      this._subChildIndex = 0;
      this.state = (newState && Object.assign(this.state, newState)) || this.state;
      const renderRes = this.renderWithStreampack();
      const finalOutput = this._recursiveSid(renderRes, 0);

      if (_event
        && this.eventsMap[_event.sid]
        && this.eventsMap[_event.sid][this._translateEventToHandler(_event.event)] instanceof Function
      ) {
        this.eventsMap[_event.sid][this._translateEventToHandler(_event.event)]();
      }
      return finalOutput;
    }
  }
}
