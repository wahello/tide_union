import React from 'react';
import './default/style.css';


export function NavigationBar(props) {
  return (
    <React.Fragment>
      <div className="component bar-title">
        <div className="bar-content">
          {props.title ? <span className="title">{props.title}</span> : ''}
          {props.children}
          {props.onAdd ? <a onClick={props.onAdd} className="icon add"></a> : ''}
          {props.onBack ? <a onClick={props.onBack} className="icon back"></a> : ''}
          {props.onDelete ? <a onClick={props.onDelete} className="icon delete"></a> : ''}
          {props.onSave ? <a onClick={props.onSave} className="txt save">Save</a> : ''}
          {props.onDone ? <a onClick={props.onDone} className="txt done">Done</a> : ''}
          {props.onApMode ? <a onClick={props.onApMode} className="txt save">Ap mode</a> : ''}
          {props.onRevise ? <a onClick={props.onRevise} className="txt save">Revise</a> : ''}
          {props.onEdit ? <a onClick={props.onEdit} className="icon edit"></a> : ''}
          {props.onMenu ? <a onClick={props.onMenu} className="icon menu"></a> : ''}
          {props.onSet ? <a onClick={props.onSet} className="icon setting"></a> : ''}
          {props.onRecord ? <a onClick={props.onRecord} className="icon record"></a> : ''}
        </div>
      </div>
    </React.Fragment>
  );
}

export default NavigationBar;
