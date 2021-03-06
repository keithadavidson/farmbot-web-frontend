import * as React from "react";
import { changeStep, removeStep, pushStep } from "./actions";
import { assign } from "lodash";
import { Step, NUMERIC_FIELDS } from "./interfaces";
import { Help } from "../help";
import { ExecuteBlock } from "./execute_block";
import { Sequence } from "./interfaces";
import { defensiveClone } from "../util";
import { t } from "i18next";
import { StepTitleBar } from "./step_title_bar";

interface CopyParams {
  dispatch: Function;
  step: Step;
}

export function copy({dispatch, step}: CopyParams) {
  let copy = assign<{}, Step>({}, step);
  dispatch(pushStep(copy));
};

interface RemoveParams {
  index: number;
  dispatch: Function;
}

export function remove({dispatch, index}: RemoveParams) {
  dispatch(removeStep(index));
}

interface UpdateStepParams {
  dispatch: Function;
  step: Step;
  index: number;
  field: string;
}

let updateStep = function ({ dispatch,
  step,
  index,
  field }: UpdateStepParams) {
  return (e: React.FormEvent) => {
    let copy = defensiveClone<Step>(step);
    let val: string = (e.target as HTMLInputElement).value;

    if (NUMERIC_FIELDS.indexOf(field) !== -1) {
      _.assign(copy.args, { [field]: parseInt(val, 10) });
    } else {
      _.assign(copy.args, { [field]: val });
    };

    dispatch(changeStep(index, copy));
  };
};

interface IStepInput {
  step: Step;
  field: "speed"
  | "pin_number"
  | "pin_value"
  | "pin_mode"
  | "operator"
  | "x"
  | "y"
  | "z"
  | "stub" // For unimplemented features.
  | "variable"
  | "data_label"
  | "milliseconds"
  | "message"
  | "lhs"
  | "op"
  | "rhs"
  | "sub_sequence_id";
  dispatch: Function;
  index: number;
}

export function StepInputBox({step, field, dispatch, index}: IStepInput) {
  let raw = (step.args as any)[field];
  let notUndefied = (_.isString(raw) || _.isNumber(raw));
  let val = notUndefied ? raw : "";

  return <input type="text"
    value={val}
    onChange={updateStep({ dispatch, step, index, field })} />;

}

export interface StepParams {
  dispatch: Function;
  step: Step;
  index: number;
  sequence: Sequence;
  sequences: Sequence[];
}

export type StepTile = (input: StepParams) => JSX.Element;

interface StepDictionary {
  [stepName: string]: StepTile;
};

let Pending = ({ dispatch, index }: StepParams) => {
  return <div>
    <Help text="Not done yet :(" />
    Coming soon!
              Delete: <i className="fa fa-trash step-control"
      onClick={() => remove({ dispatch, index })} />
  </div>;
};

export let stepTiles: StepDictionary = {
  emergency_stop: Pending,
  home_all: Pending,
  home_x: Pending,
  home_y: Pending,
  home_z: Pending,
  read_status: Pending,
  write_parameter: Pending,
  read_parameter: Pending,
  execute: ExecuteBlock,
  if_statement: function ({dispatch, step, index}: StepParams) {
    return (<div>
      <div className="step-wrapper">
        <div className="row">
          <div className="col-sm-12">
            <div className="step-header">
              <StepTitleBar index={index}
                dispatch={dispatch}
                step={step} />
              <i className="fa fa-arrows-v step-control" />
              <i className="fa fa-clone step-control"
                onClick={() => copy({ dispatch, step })} />
              <i className="fa fa-trash step-control"
                onClick={() => remove({ dispatch, index })} />
              <Help text={(`Detailed documentation coming soon`)} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="step-content move-absolute-step">
              <div className="row">
                <div className="col-xs-6 col-md-3">
                  <label>{t("LHS")}</label>
                  <StepInputBox dispatch={dispatch}
                    step={step}
                    index={index}
                    field="lhs" />
                </div>
                <div className="col-xs-6 col-md-3">
                  <label>{t("OPPERATOR")}</label>
                  <StepInputBox dispatch={dispatch}
                    step={step}
                    index={index}
                    field="op" />
                </div>
                <div className="col-xs-6 col-md-3">
                  <label>{t("RHS")}</label>
                  <StepInputBox dispatch={dispatch}
                    step={step}
                    index={index}
                    field="rhs" />
                </div>
                <div className="col-xs-6 col-md-3">
                  <label>{t("Sub Sequence")}</label>
                  <StepInputBox dispatch={dispatch}
                    step={step}
                    index={index}
                    field="sub_sequence_id" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  },
  move_relative: function ({dispatch, step, index}: StepParams) {
    return (<div>
      <div className="step-wrapper">
        <div className="row">
          <div className="col-sm-12">
            <div className="step-header move-relative-step">
              <StepTitleBar index={index}
                dispatch={dispatch}
                step={step} />
              <i className="fa fa-arrows-v step-control" />
              <i className="fa fa-clone step-control"
                onClick={() => copy({ dispatch, step })} />
              <i className="fa fa-trash step-control"
                onClick={() => remove({ dispatch, index })} />
              <Help text={(`The Move Relative step instructs FarmBot to \
                        move the specified distance from its current location. \
                        For example, if FarmBot is currently at X=1000, Y=1000 \
                        and it receives a Move Relative where X=0 and Y=3000, then \
                        FarmBot will move to X=1000, Y=4000. If FarmBot must move in \
                        multiple directions, it will move diagonally. If you \
                        require straight movements along one axis at a time, use \
                        multiple Move Relative steps. Move Relative steps should \
                        be preceded by a Move Absolute step to ensure you are \
                        starting from a known location.`)} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="step-content move-relative-step">
              <div className="row">
                <div className="col-xs-6 col-md-3">
                  <label>{t("X (mm)")}</label>
                  <StepInputBox dispatch={dispatch}
                    step={step}
                    index={index}
                    field="x" />
                </div>
                <div className="col-xs-6 col-md-3">
                  <label>{t("Y (mm)")}</label>
                  <StepInputBox dispatch={dispatch}
                    step={step}
                    index={index}
                    field="y" />
                </div>
                <div className="col-xs-6 col-md-3">
                  <label>{t("Z (mm)")}</label>
                  <StepInputBox dispatch={dispatch}
                    step={step}
                    index={index}
                    field="z" />
                </div>
                <div className="col-xs-6 col-md-3">
                  <label>{t("Speed")}</label>
                  <StepInputBox dispatch={dispatch}
                    step={step}
                    index={index}
                    field="speed" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  },
  "move_absolute": function ({dispatch, step, index}: StepParams) {
    return (<div>
      <div className="step-wrapper">
        <div className="row">
          <div className="col-sm-12">
            <div className="step-header move-absolute-step">
              <StepTitleBar index={index}
                dispatch={dispatch}
                step={step} />
              <i className="fa fa-arrows-v step-control" />
              <i className="fa fa-clone step-control"
                onClick={() => copy({ dispatch, step })} />
              <i className="fa fa-trash step-control"
                onClick={() => remove({ dispatch, index })} />
              <Help text={(`The Move Absolute step instructs FarmBot to
                      move to the specified coordinate regardless of the current
                      position. For example, if FarmBot is currently at X=1000,
                      Y=1000 and it receives a Move Absolute where X=0 and Y=3000,
                      then FarmBot will move to X=0, Y=3000. If FarmBot must move in
                      multiple directions, it will move diagonally. If you
                      require straight movements along one axis at a time,
                      use multiple Move Absolute steps. Coming soon: Offsets
                      allow you to more easily instruct FarmBot to move to a
                      location, but offset from it by the specified amount. For
                      example moving to just above where a tool is located. Using
                      offsets lets FarmBot do the math for you.`)} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="step-content move-absolute-step">
              <div className="row">
                <div className="col-xs-6 col-md-3">
                  <label>{t("X (mm)")}</label>
                  <StepInputBox dispatch={dispatch}
                    step={step}
                    index={index}
                    field="x" />
                </div>
                <div className="col-xs-6 col-md-3">
                  <label>{t("Y (mm)")}</label>
                  <StepInputBox dispatch={dispatch}
                    step={step}
                    index={index}
                    field="y" />
                </div>
                <div className="col-xs-6 col-md-3">
                  <label>{t("Z (mm)")}</label>
                  <StepInputBox dispatch={dispatch}
                    step={step}
                    index={index}
                    field="z" />
                </div>
                <div className="col-xs-6 col-md-3">
                  <label>{t("Speed")}</label>
                  <StepInputBox dispatch={dispatch}
                    step={step}
                    index={index}
                    field="speed" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  },
  "write_pin": function ({dispatch, step, index}: StepParams) {
    return (<div>
      <div className="step-wrapper">
        <div className="row">
          <div className="col-sm-12">
            <div className="step-header write-pin-step">
              <StepTitleBar index={index}
                dispatch={dispatch}
                step={step} />
              <i className="fa fa-arrows-v step-control" />
              <i className="fa fa-clone step-control"
                onClick={() => copy({ dispatch, step })} />
              <i className="fa fa-trash step-control"
                onClick={() => remove({ dispatch, index })} />
              <Help text={(`The Write Pin step instructs FarmBot to
                      set the specified pin on the Arduino to the specified mode
                      and value. A Pin Mode of 0 is for on/off control, while
                      a Pin Mode of 1 is for PWM (pulse width modulation).`)} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="step-content write-pin-step">
              <div className="row">
                <div className="col-xs-6 col-md-3">
                  <label>{t("Pin Number")}</label>
                  <StepInputBox dispatch={dispatch}
                    step={step}
                    index={index}
                    field="pin_number" />
                </div>
                <div className="col-xs-6 col-md-3">
                  <label>{t("Value")}</label>
                  <StepInputBox dispatch={dispatch}
                    step={step}
                    index={index}
                    field="pin_value" />
                </div>
                <div className="col-xs-6 col-md-3">
                  <label>{t("Pin Mode")}</label>
                  <StepInputBox dispatch={dispatch}
                    step={step}
                    index={index}
                    field="pin_mode" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

  },
  "wait": function ({dispatch, step, index}: StepParams) {
    return (<div>
      <div className="step-wrapper">
        <div className="row">
          <div className="col-sm-12">
            <div className="step-header wait-step">
              <StepTitleBar index={index}
                dispatch={dispatch}
                step={step} />
              <i className="fa fa-arrows-v step-control" />
              <i className="fa fa-clone step-control"
                onClick={() => copy({ dispatch, step })} />
              <i className="fa fa-trash step-control"
                onClick={() => remove({ dispatch, index })} />
              <Help text={(`The Wait step instructs FarmBot to wait for the
                      specified amount of time. Use it in combination with the
                      Pin Write step to water for a length of time.`)} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="step-content wait-step">
              <div className="row">
                <div className="col-xs-6 col-md-3">
                  <label>{t("Time in milliseconds")}</label>
                  <StepInputBox dispatch={dispatch}
                    step={step}
                    index={index}
                    field="milliseconds" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

  },
  "send_message": function ({dispatch, step, index}: StepParams) {
    return (<div>
      <div className="step-wrapper">
        <div className="row">
          <div className="col-sm-12">
            <div className="step-header send-message-step">
              <StepTitleBar index={index}
                dispatch={dispatch}
                step={step} />
              <i className="fa fa-arrows-v step-control" />
              <i className="fa fa-clone step-control"
                onClick={() => copy({ dispatch, step })} />
              <i className="fa fa-trash step-control"
                onClick={() => remove({ dispatch, index })} />
              <Help text={(`The Send Message step instructs FarmBot to
                      send a custom message to the logs. This can help you with
                      debugging your sequences. Eventually you will be able to
                      receive push notifications and email alerts of these messages!`)} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="step-content send-message-step">
              <div className="row">
                <div className="col-xs-12">
                  <label>{t("Message")}</label>
                  <StepInputBox dispatch={dispatch}
                    step={step}
                    index={index}
                    field="message" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

  },
  "read_pin": function ({dispatch, step, index}: StepParams) {
    return (<div>
      <div className="step-wrapper">
        <div className="row">
          <div className="col-sm-12">
            <div className="step-header read-pin-step">
              <StepTitleBar index={index}
                dispatch={dispatch}
                step={step} />
              <i className="fa fa-arrows-v step-control" />
              <i className="fa fa-clone step-control"
                onClick={() => copy({ dispatch, step })} />
              <i className="fa fa-trash step-control"
                onClick={() => remove({ dispatch, index })} />
              <Help text={(`The Read Pin step instructs FarmBot to
                      read the current value of the specified pin. 
                      A Pin Mode of 0 is for on/off control, while
                      a Pin Mode of 1 is for PWM (pulse width modulation).`)} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="step-content read-pin-step">
              <div className="row">
                <div className="col-xs-6 col-md-3">
                  <label>{t("Pin Number")}</label>
                  <StepInputBox dispatch={dispatch}
                    step={step}
                    index={index}
                    field="pin_number" />
                </div>
                <div className="col-xs-6 col-md-3">
                  <label>{t("Data Label")}</label>
                  <StepInputBox dispatch={dispatch}
                    step={step}
                    index={index}
                    field="data_label" />
                </div>
                <div className="col-xs-6 col-md-3">
                  <label>{t("Pin Mode")}</label>
                  <StepInputBox dispatch={dispatch}
                    step={step}
                    index={index}
                    field="pin_mode" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

  },
};
