function onSubmit() {
  const form = FormApp.getActiveForm()
  const responses = form.getResponses()
  console.log(responses)
}
