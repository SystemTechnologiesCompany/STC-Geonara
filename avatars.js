'use strict';
const profileAvatarChoices=[
  {
    "id": "avatar-01",
    "src": "assets/avatars/avatar-01.svg",
    "label": "Avatar 1",
    "source": "account-avatar-profile-user-2-svgrepo-com.svg"
  },
  {
    "id": "avatar-02",
    "src": "assets/avatars/avatar-02.svg",
    "label": "Avatar 2",
    "source": "account-avatar-profile-user-3-svgrepo-com.svg"
  },
  {
    "id": "avatar-03",
    "src": "assets/avatars/avatar-03.svg",
    "label": "Avatar 3",
    "source": "account-avatar-profile-user-5-svgrepo-com.svg"
  },
  {
    "id": "avatar-04",
    "src": "assets/avatars/avatar-04.svg",
    "label": "Avatar 4",
    "source": "account-avatar-profile-user-6-svgrepo-com.svg"
  },
  {
    "id": "avatar-05",
    "src": "assets/avatars/avatar-05.svg",
    "label": "Avatar 5",
    "source": "account-avatar-profile-user-7-svgrepo-com.svg"
  },
  {
    "id": "avatar-06",
    "src": "assets/avatars/avatar-06.svg",
    "label": "Avatar 6",
    "source": "account-avatar-profile-user-8-svgrepo-com (1).svg"
  },
  {
    "id": "avatar-07",
    "src": "assets/avatars/avatar-07.svg",
    "label": "Avatar 7",
    "source": "account-avatar-profile-user-10-svgrepo-com (1).svg"
  },
  {
    "id": "avatar-08",
    "src": "assets/avatars/avatar-08.svg",
    "label": "Avatar 8",
    "source": "account-avatar-profile-user-11-svgrepo-com (1).svg"
  },
  {
    "id": "avatar-09",
    "src": "assets/avatars/avatar-09.svg",
    "label": "Avatar 9",
    "source": "account-avatar-profile-user-12-svgrepo-com.svg"
  },
  {
    "id": "avatar-10",
    "src": "assets/avatars/avatar-10.svg",
    "label": "Avatar 10",
    "source": "account-avatar-profile-user-13-svgrepo-com.svg"
  },
  {
    "id": "avatar-11",
    "src": "assets/avatars/avatar-11.svg",
    "label": "Avatar 11",
    "source": "account-avatar-profile-user-14-svgrepo-com.svg"
  },
  {
    "id": "avatar-12",
    "src": "assets/avatars/avatar-12.svg",
    "label": "Avatar 12",
    "source": "account-avatar-profile-user-15-svgrepo-com (1).svg"
  },
  {
    "id": "avatar-13",
    "src": "assets/avatars/avatar-13.svg",
    "label": "Avatar 13",
    "source": "account-avatar-profile-user-16-svgrepo-com.svg"
  },
  {
    "id": "avatar-14",
    "src": "assets/avatars/avatar-14.svg",
    "label": "Avatar 14",
    "source": "account-avatar-profile-user-svgrepo-com.svg"
  },
  {
    "id": "avatar-15",
    "src": "assets/avatars/avatar-15.svg",
    "label": "Avatar 15",
    "source": "account-avatar-profile-user-4-svgrepo-com (1).svg"
  },
  {
    "id": "avatar-16",
    "src": "assets/avatars/avatar-16.svg",
    "label": "Avatar 16",
    "source": "account-avatar-profile-user-9-svgrepo-com (1).svg"
  }
];
function getProfileAvatar(id){return profileAvatarChoices.find(avatar=>avatar.id===id)||null;}
function randomAvatarId(excludeId){const pool=profileAvatarChoices.filter(avatar=>avatar.id!==excludeId);return pool[Math.floor(Math.random()*pool.length)].id;}
function withDefaultAvatar(profile){return {...profile,avatarId:getProfileAvatar(profile.avatarId)?profile.avatarId:randomAvatarId()};}
