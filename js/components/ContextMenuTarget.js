import React from "react";
import PropTypes from "prop-types";
import { ContextMenu } from "./ContextMenu";

export default class ContextMenuTarget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: false };
    this._handleHandleClick = this._handleHandleClick.bind(this);
    this._handleGlobalClick = this._handleGlobalClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener("click", this._handleGlobalClick);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this._handleGlobalClick);
  }

  _handleHandleClick() {
    this.setState({ selected: !this.state.selected });
  }

  _handleGlobalClick(e) {
    if (
      this.state.selected &&
      // Not sure how, but it's possible for this to get called when handleNode is null/undefined.
      // https://sentry.io/share/issue/2066cd79f21e4f279791319f4d2ea35d/
      this.handleNode &&
      !this.handleNode.contains(e.target)
    ) {
      this.setState({ selected: false });
    }
  }

  render() {
    const { handle, children, top, bottom, ...passThroughProps } = this.props;
    const rect = this.handleNode
      ? this.handleNode.getBoundingClientRect()
      : { top: 0, left: 0 };
    return (
      <div {...passThroughProps}>
        <div
          className="handle"
          style={{ width: "100%", height: "100%" }}
          ref={node => (this.handleNode = node)}
          onClick={this._handleHandleClick}
        >
          {handle}
        </div>
        <ContextMenu
          selected={this.state.selected}
          offsetTop={rect.top}
          offsetLeft={rect.left}
          top={top}
          bottom={bottom}
        >
          {children}
        </ContextMenu>
      </div>
    );
  }
}

ContextMenuTarget.propTypes = {
  children: PropTypes.any.isRequired,
  handle: PropTypes.any.isRequired,
  top: PropTypes.bool,
  bottom: PropTypes.bool
};
