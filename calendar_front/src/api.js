import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://port-0-calendar-backend-ac2nll4pdsc1.sel3.cloudtype.app', //장고 서버 주소
  withCredentials: true, // 쿠키를 포함시키기 위한 설정 추가
});

export default instance;

// 로그인 API 함수
export const loginApi = (data) => {
  return instance.post('/api/v1/users/login/', data);
};

// 회원가입 API 함수
export const signupApi = (data) => {
  return instance.post('/api/v1/users/signup/', data);
};

// 아이디 중복 확인 API 함수
export const checkIdAvailabilityApi = (data) => {
  return instance.post('/api/v1/users/idcheck/', data);
};

// 팀 생성 API 함수
export const createTeamApi = (data) => {
  return instance.post('/api/v1/teams/', data);
};

export const nicknameCheckApi = (team_id, nicknames) => {
  return instance.get(`/api/v1/${nicknames}/${team_id}/`);
};
