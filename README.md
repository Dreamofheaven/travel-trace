# travel-trace 리팩토링
## 23.8.28(계획)
```
0. 학습
  - JWT
  - Django-Rest-Framework(DRF)
  - RESTful API(Swagger)
  - 리액트 기초
1. 리팩토링
  - 코드 정리
  - 모듈화
2. 버그 픽스 및 에러 핸들링
  - 라우터 오류(리액트)
3. 배포
  - AWS EC2 or AWS Elastic Beanstalk
4. 기능 업그레이드
  - 기존 프로젝트 기능 향상
    - 알림 기능 구현
    - 프로필 업데이트, 비밀번호 변경, 회원탈퇴 기능 등

- Account
  - JWT 기반 회원가입, 로그인, 로그아웃 코드 정리
```

## 23.8.29.
```
- Account
  - 프로필 조회, 수정, 삭제 수정
  - 비밀번호 변경 VIEW 구축(ing)
```

## 23.8.30.
```
- Account
  - 비밀번호 변경 VIEW 구축 완료
  - 팔로우, 북마크 코드 수정(간결화)
  - views 폴더 정리(가독성을 위해 파일 분리)
  - serializers.py 정리
```

## 23.9.13.
```
- DRF serializer 공부
- Article
  - serializers.py 정리
```

## 23.9.15.
```
- DRF serializer 공부
- Article
  - serializers.py 수정(CRD까지 완성)
```
