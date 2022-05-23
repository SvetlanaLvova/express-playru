const deleteTrack = document.getElementById('deleteTrack');

deleteTrack.addEventListener('click', async (e) => {
  e.preventDefault();
  console.log('=========================')
  const { track } = e.target.dataset; //связано с data-track={{currentTrack.id}}> Удалить</button> в detailTrack.hbs

  const delResponse = await fetch(`/track/delete/${track}`, {
    method: 'DELETE'
  })
  if(delResponse.status === 222){
    window.location.assign(`/`);
  }
  if(delResponse.status===404){
    alert('ВЫ НЕ МОЖЕТЕ УДАЛИТЬ ЭТОТ ТРЕК')
  }

});
