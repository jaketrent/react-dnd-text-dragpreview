# react-dnd-text-dragpreview

react-dnd allows you to use an image for a drag preview.  In order to get text as a drag preview, you have to write text to a canvas and export an image.  This library wraps up the canvas interaction.

![text drag preview in action](http://i.imgur.com/glegZVc.gif)

## Install

```
npm install react-dnd-text-dragpreview --save-dev
```

## Usage

```js
import { createDragPreview } from 'react-dnd-text-dragpreview'

const styles = {
  fontSize: '12px'
}

const dragPreviewImage = createDragPreview('Custom Drag Text', styles)
```

### Style Configuration

There are several styling options.  These styles look like react inline styles according to naming convention, but only this set are currently available (not all inline styles options).

These are the default styles that you can override via the 2nd argument to `createDragPreview`:

```js
{
  backgroundColor: '#efefef',
  borderColor: '#1a1a1a',
  color: '#1a1a1a',
  fontSize: 14,
  paddingTop: 5,
  paddingRight: 5,
  paddingBottom: 5,
  paddingLeft: 5
}
```

## React Usage

In React, you're going to be using a dragPreview for `react-dnd` within a component.

Here's a demo component that uses `react-dnd`, `TableRow`, which will show a drag preview of "Moving X rows" when dragging.  See comments inline for relevant pieces:

```js
import { DragSource } from 'react-dnd';
import React from 'react'
import { createDragPreview } from 'react-dnd-text-dragpreview'

import { ItemTypes } from './constants'

const { bool, func, number, object, string } = React.PropTypes

// overrides dragPreview style
var dragPreviewStyle = {
  backgroundColor: 'rgb(68, 67, 67)',
  borderColor: '#F96816',
  color: 'white',
  fontSize: 15,
  paddingTop: 4,
  paddingRight: 7,
  paddingBottom: 6,
  paddingLeft: 7
}

const rowSource = {
  beginDrag(props) {
    if (typeof props.onDragRow === 'function')
      props.onDragRow(props.dataId)

    return {
      dataId: props.dataId
    }
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview()
  }
}

// provides custom message for dragPreview
function formatDragMessage(numRows) {
  const noun = numRows === 1 ? 'row' : 'rows'
  return `Moving ${num} ${noun}`
}

class TableRow extends React.Component {
  componentDidMount() {
    // handles first time dragPreview setup
    this.dragPreview = createDragPreview(formatDragMessage(this.props.numRows), dragPreviewStyle)
    this.props.connectDragPreview(this.dragPreview)
  }
  componentDidUpdate(prevProps) {
    // handles updates to the dragPreview image as the dynamic numRows value changes
    this.dragPreview = createDragPreview(formatDragMessage(this.props.numRows), dragPreviewStyle, this.dragPreview)
  }
  render() {
    return this.props.connectDragSource(
      <tr>
        <td className={this.props.css.checkBoxCell}>
          Drag me
        </td>
      </tr>
    )
  }
}

TableRow.propTypes = {
  connectDragPreview: func.isRequired,
  connectDragSource: func.isRequired,
  dataId: string.isRequired,
  numRows: number.isRequired,
  onDragRow: func.isRequired
}

export default DragSource(ItemTypes.ROW, rowSource, collect)(TableRow)
```
