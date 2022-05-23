const { editTrackForm } = document.forms;
editTrackForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const updatedTrack = {
    title: editTrackForm.title.value,
    description: editTrackForm.description.value,
    img: editTrackForm.img.value,
  };
  const updResponse = await fetch(`/track/edit/${editTrackForm.dataset.trackid}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(updatedTrack),
  });
  if (updResponse.status === 200) {
    alert('данные обновлены');
    window.location.href=`/`;
  } else {
    alert('какая-то ошибка, попробуйте еще раз позднее');
  }
});
