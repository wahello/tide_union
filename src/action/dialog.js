export const showDialog = (title, content, buttons, callback) => ({
  type: 'SHOW_DIALOG',
  title,
  content,
  buttons,
  callback
})

export const hideDialog = (callback) => ({
  type: 'HIDE_DIALOG',
  callback
})


