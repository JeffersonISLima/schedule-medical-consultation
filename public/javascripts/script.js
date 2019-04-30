document.getElementById('doctorSpecialty').addEventListener('change', () => {
  const selectValue = document.getElementById('doctorSpecialty').value;
  axios.get(`/paciente/medicos/${selectValue}`)
    .then((res) => {
      console.log(res);
      document.getElementById('doctorOption').innerHTML = '';
      res.data.forEach((e) => {
        document.getElementById('doctorOption').innerHTML += `${e.name}`;
      });


    })
    .catch(err => console.log(err));
});
