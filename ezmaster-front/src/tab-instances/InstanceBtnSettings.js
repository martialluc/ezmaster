import React, { Component } from "react";
import { Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import { toast } from "react-toastify";

import AceEditor from "react-ace";
import "brace/mode/json";
import "brace/mode/text";
import "brace/ext/searchbox";
import "brace/theme/github";

import "./InstanceBtnSettings.css";

import { updateInstanceConfig } from "../models/ModelInstances2.js";
import { fetchInstanceDetail } from "../models/ModelInstances2.js";

class InstanceBtnSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      modalIsFS: false,
      code: "",
      codeFormat: "json"
    };
    this.currentCode = "";
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleIsFS = this.toggleIsFS.bind(this);
    this.onCodeChange = this.onCodeChange.bind(this);
    this.doUpdateInstanceConfig = this.doUpdateInstanceConfig.bind(this);
  }

  toggleModal() {
    const self = this;

    self.setState({
      modalIsOpen: !this.state.modalIsOpen
    });

    // fetch the instance config just when the popup is open
    if (!self.state.modalIsOpen) {
      fetchInstanceDetail(self.props.instance.containerId, function(err, data) {
        try {
          JSON.parse(data.config);
          self.setState({ code: data.config, codeFormat: "json" });
        } catch (err2) {
          self.setState({ code: data.config, codeFormat: "text" });
        }
        self.currentCode = data.config;
      });
    }
  }

  toggleIsFS() {
    this.setState({
      modalIsFS: !this.state.modalIsFS,
      code: this.currentCode
    });

    // need also to resize the ACE editor of it will truncate the text
    // we also re-focus to the edit area
    setImmediate(
      function() {
        this.refs[this.props.instance.technicalName + "-ace"].editor.resize();
        this.refs[this.props.instance.technicalName + "-ace"].editor.focus();
      }.bind(this)
    );
  }

  onCodeChange(newValue) {
    // Do not store the new value in the store now because it will
    // re-render the react component and it will generates stranges error
    // in the ace editor.
    // This is why we use the currentCode temp variable and push it in
    // the store just when switching to fullscreen (because re-render will occurs).
    this.currentCode = newValue;
  }

  doUpdateInstanceConfig() {
    const self = this;

    // async instance config update
    updateInstanceConfig(
      self.props.instance.containerId,
      self.currentCode,
      function(err) {
        if (err) {
          toast.error(
            <div>
              {self.props.instance.technicalName} config update error:{" "}
              {"" + err}
            </div>
          );
        } else {
          toast.info(
            <div>
              <code>{self.props.instance.technicalName}</code> config has been
              updated
            </div>
          );
        }
      }
    );

    // hide the popup
    self.setState({
      modalIsOpen: !self.state.modalIsOpen
    });
  }

  render() {
    return (
      <div className={this.props.className}>
        <Button
          color="link"
          className={this.props.classNameBtn + " ezmaster-a-cog"}
          onClick={this.toggleModal}
        >
          <i
            className={"fa fa-cog"}
            id={this.props.instance.technicalName + "-cog"}
          />
        </Button>

        <Modal
          isOpen={this.state.modalIsOpen}
          toggle={this.toggleModal}
          className={
            this.state.modalIsFS
              ? "ezmaster-modal-settings modal-fullscreen"
              : "ezmaster-modal-settings"
          }
        >
          <ModalHeader toggle={this.toggleModal}>
            Edit the <code>{this.props.instance.technicalName}</code>{" "}
            configuration{" "}
          </ModalHeader>
          <ModalBody>
            <AceEditor
              mode={this.state.codeFormat}
              theme="github"
              width="100%"
              height=""
              focus={true}
              wrapEnabled={true}
              tabSize={2}
              ref={this.props.instance.technicalName + "-ace"}
              name={this.props.instance.technicalName + "-ace"}
              enableBasicAutocompletion={true}
              enableLiveAutocompletion={true}
              enableSnippets={true}
              fontSize={"1.5rem"}
              onChange={this.onCodeChange}
              value={this.state.code}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="link"
              onClick={this.toggleIsFS}
              className="modal-fullscreen-btn"
            >
              <i
                className={
                  "fa " + (this.state.modalIsFS ? "fa-compress" : "fa-expand")
                }
                id={this.props.instance.technicalName + "-settings-fs"}
              />
            </Button>
            <UncontrolledTooltip
              placement="top"
              target={this.props.instance.technicalName + "-settings-fs"}
            >
              Edit the configuration in fullscreen mode.
            </UncontrolledTooltip>
            <Button color="secondary" onClick={this.toggleModal}>
              Cancel
            </Button>
            <Button color="primary" onClick={this.doUpdateInstanceConfig}>
              Update
            </Button>
          </ModalFooter>
        </Modal>

        <UncontrolledTooltip
          placement="top"
          target={this.props.instance.technicalName + "-cog"}
        >
          Edit settings of <code>{this.props.instance.technicalName}</code>
        </UncontrolledTooltip>
      </div>
    );
  }
}

export default InstanceBtnSettings;