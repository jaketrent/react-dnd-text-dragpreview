function getTextWidth(ctx, style, text) {
  if (typeof ctx.measureText === 'function') {
    return ctx.measureText(text).width
  } else {
    var perCharWidth = style.fontSize / 1.7
    return text.length * perCharWidth
  }
}

function parseBoxShadow(style) {
  var parts = (style.boxShadow || '').replace(/px/g, '').split(/[^,] /)
  var offsetX = parts[0]
  var offsetY = parts[1]
  var blur = parts[2]
  var color = parts[3]
  return {
    shadowBlur: parseInt(blur, 10) || 0,
    shadowColor: color || 'transparent',
    shadowOffsetX: parseInt(offsetX, 10) || 0,
    shadowOffsetY: parseInt(offsetY, 10) || 0
  }
}

var defaultStyle = {
  backgroundColor: '#efefef',
  borderColor: '#1a1a1a',
  color: '#1a1a1a',
  fontSize: 14,
  paddingTop: 5,
  paddingRight: 5,
  paddingBottom: 5,
  paddingLeft: 5
}

module.exports = function createDragPreview(text, style, img) {
  if (!text) text = '...'

  if (!style) style = defaultStyle

  if (!img) img = new Image()

  var shadowStyle = parseBoxShadow(style)
  var marginBottom = shadowStyle.shadowOffsetY + (shadowStyle.shadowBlur * 2)
  var marginRight = shadowStyle.shadowOffsetX + (shadowStyle.shadowBlur * 2)
  var rectHeight = style.paddingTop + style.fontSize + style.paddingBottom
  var rectStrokeWidth = 1

  var c = document.createElement('canvas')
  c.height = rectHeight + marginBottom
  var ctx = c.getContext('2d')

  ctx.font = style.fontSize + 'px sans-serif' // once before for measurement
  var textWidth = getTextWidth(ctx, style, text)
  var rectWidth = style.paddingLeft + textWidth + style.paddingRight

  ctx.canvas.width = style.paddingLeft + textWidth + style.paddingRight + marginRight + (rectStrokeWidth * 2)
  ctx.font = style.fontSize + 'px sans-serif' // once after for actually styling

  ctx.rect(0, 0, rectWidth, rectHeight)

  ctx.save()
  ctx.fillStyle = style.backgroundColor
  ctx.strokeStyle = style.borderColor
  ctx.shadowColor = shadowStyle.shadowColor
  ctx.shadowBlur = shadowStyle.shadowBlur
  ctx.shadowOffsetX = shadowStyle.shadowOffsetX
  ctx.shadowOffsetY = shadowStyle.shadowOffsetY
  ctx.fill()
  ctx.stroke()
  ctx.restore()

  ctx.fillStyle = style.color
  ctx.fillText(text, style.paddingLeft, (style.paddingTop * .75) + style.fontSize);

  img.src = c.toDataURL()

  return img
}
