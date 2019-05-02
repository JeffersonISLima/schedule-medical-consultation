document.getElementById('doctorSpecialty').addEventListener('change', () => {
  const selectValue = document.getElementById('doctorSpecialty').value;
  axios.get(`/paciente/medicos/${selectValue}`)
    .then((res) => {
      document.getElementById('doctors').innerHTML = '';
      res.data.forEach((e) => {
        document.getElementById('doctors').innerHTML += `<option id=${e.name} value="${e.name}">${e.name}</option>`;
      });
    })
    .catch(err => console.log(err));
});

document.getElementById('date').addEventListener('change', () => {
  const selectdr = document.getElementById('doctors').value;
  const selectdate = document.getElementById('date').value;
  console.log(selectdate);
  const allHours = ['08:00', '10:00', '14:00', '16:00', '18:00', '20:00'];
  axios.get(`/paciente/date/${selectdate}/${selectdr}`)
    .then((res) => {
      const scheduledHours = res.data.map(e => e.hour);
      const freeHours = allHours.filter(e => !scheduledHours.includes(e));
      document.getElementById('hours').value = '';
      console.log(freeHours);
      freeHours.forEach((e) => {
        document.getElementById('hours').innerHTML += `<option id=${e} value=${e}>${e}</option>`;
      });
    })
    .catch(err => console.log(err));
});