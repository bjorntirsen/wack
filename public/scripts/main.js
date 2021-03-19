//Global variables
const userId = document.getElementById('userId').value;
const userName = document.getElementById('userName').value;
const submit_btn = document.getElementById('submit_btn');
const channelId = window.location.href.split('/').slice(-1)[0];

document.addEventListener('DOMContentLoaded', (e) => {
  e.preventDefault();
  useApi.fetchChannels();
  useApi.fetchUsers();
  useSocket.emitUserData();
});

if (document.getElementById('submit_btn') !== null) {
  document.getElementById('submit_btn').addEventListener('click', (e) => {
    e.preventDefault();
    useApi.sendPostToServer();
    useSocket.emitPost();
    document.getElementById('content').value = '';
  });
}
