![img](<https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F23f4183d-c084-4f28-864c-6055a1a20fa0%2F___(5).png?table=block&id=7c43a727-0962-4c7f-ad67-1a6f9dece6ae&spaceId=cc4e63fe-9341-442b-823d-efdb19e51566&width=3070&userId=898bd393-2284-49ba-adb6-daa3f952d4b0&cache=v2>)

# 🍭 Project

- **SOPT 28th APPJAM, HANDY-CANDY**
- 프로젝트 기간: 2021.06.26~2021.07.17

> 내 손 안의 달콤한 보상, HANDY-CANDY

![Desktop - 1](https://user-images.githubusercontent.com/57944153/123970621-3d61cf80-d9f4-11eb-90db-2ad8f549354f.png)

# 🛠 개발 환경

![img](https://img.shields.io/badge/typescript-4.3.4-blue)
![img](https://img.shields.io/badge/ts--node-10.0.0-green)
![img](https://img.shields.io/badge/eslint-4.28.1-white)
![img](https://img.shields.io/badge/commitlint-12.1.4-black)
![img](https://img.shields.io/badge/prettier-2.3.2-red)
![img](https://img.shields.io/badge/husky-7.0.0-yellow)

# 📜 Coding Convention

### 📂 폴더구조

- src
  - Logger
  - api
  - config
  - interfaces
  - middleware
  - models
  - jobs
  - services

### **🖋 네이밍**

**Class & Constructor**

- 클래스/생성자 이름은 **UpperCamelCase**를 사용합니다.
- 글자의 길이는 20자 이내로 제한합니다.

좋은 예 >

```typescript
  class HandyCandy
```

나쁜 예 >

```typescript
class handycandy {}
```

**함수 & 변수 & 인스턴스**

- 함수와 변수, 인스턴스에는 **lowerCamelCase**를 사용합니다.

### **🏷 주석**

- `// MARK:` 를 사용해서 연관된 코드를 구분짓습니다.
- `/** */` 를 사용해서 코드 작성자의 이름을 명시합니다.

### **📎 기타**

- , 뒤에 반드시 띄어쓰기를 합니다.
- 함수끼리 1줄 개행합니다.
- 중괄호는 아래와 같은 형식으로 사용합니다.

```typescript
if (condition) {
  Statements;
  /*
  ...
  */
}
```

# ✉️ Commit Messge Rules

**서버캔디** 들의 **Git Commit Message Rules**

- 반영사항을 바로 확인할 수 있도록 작은 기능 하나라도 구현되면 커밋을 권장합니다.
- 커밋할 땐 **서버슬랙에 노티**, **pr 필수, review request 필수**입니다.
- 기능 구현이 완벽하지 않을 땐, 각자 브랜치에 커밋을 해주세요.

### **📜 커밋 메시지 명령어 모음**

    커밋 규칙을 지키지 않으면 commitlint에서 자동으로 에러가 발생합니다.

```
- feat    : 기능 (새로운 기능)
- fix     : 버그 (버그 수정)
- refactor: 리팩토링
- style   : 스타일 (코드 형식, 세미콜론 추가: 비즈니스 로직에 변경 없음)
- docs    : 문서 (문서 추가, 수정, 삭제)
- test    : 테스트 (테스트 코드 추가, 수정, 삭제: 비즈니스 로직에 변경 없음)
- chore   : 기타 변경사항 (빌드 스크립트 수정 등)
```

### **ℹ️ 커밋 메세지 형식**

- `커밋메세지: 설명` 형식으로 커밋 메시지를 작성합니다.
- 커밋 설명은 무조건 영어로 한다고 좋은게 아닙니다.
- 최대한 내용 포함과 자세할수록 좋습니다.
- 하지만 너무 길게는 안됩니다.

좋은 예 >

```
  feat: search api 추가
```

나쁜 예 >

```
  검색 api 추가
```

좋은 예 >

```
  test: 회원가입 로직 test code 작성
```

나쁜 예 >

```
  test code 작성,
  test: test code 작성
```

## **💻 Github mangement**

**서버캔디** 들의 WorkFlow : **Gitflow Workflow**

- Main과 Develop 브랜치

  메인(main): 메인 브랜치 -> product

  개발(development): 기능들의 통합 브랜치 역할❗️ 이 브랜치에서 기능별로 브랜치를 따 모든 구현이 이루어집니다. -> alpha

- Main에 직접적인 commit, push는 가급적 금지합니다. (X)

- 커밋 메세지는 다른 사람들이 봐도 이해할 수 있게 써주세요.

- 풀리퀘스트를 통해 코드 리뷰를 해보아요.

```
development에 바로 merge하지 않습니다.
pr을 development로 해주세요.
development에서 완성이 되면 main으로 그때 그때 merge합니다.

merge는 github에서 진행합니다.
merge pull request 금지 -> squash and merge 클릭
rebase 또는 conflict 해결은 github에서 하지 않습니다.

local code에서 git status로 확인해가며 적용 후 force push 진행합니다.
force push 정말 조심해주세요.
```

<img src="https://camo.githubusercontent.com/5af55d4c184cd61dabf0747bbf9ebc83b358eccb/68747470733a2f2f7761632d63646e2e61746c61737369616e2e636f6d2f64616d2f6a63723a62353235396363652d363234352d343966322d623839622d3938373166396565336661342f30332532302832292e7376673f63646e56657273696f6e3d393133" width="80%">

**각자 자신이 맡은 기능 구현에 성공시! 브랜치 다 쓰고 병합하는 방법**

- 브랜치 만듦

```
git branch feature/issue-번호
```

- 브랜치 전환

```
git checkout feature/issue-번호
```

- 브랜치 만듦과 동시에 전환

```
git checkout -b feature/issue-번호
```

- 코드 변경 (현재 **feature/issue-번호** 브랜치)

```
git add .
git commit -m "커밋 메세지" -a // 이슈보드 이름대로 커밋
```

    - git add . 를 기능별로 모아둔게 아니라면 자주 쓰지 말아주세요.

    - 해당 기능끼리 묶어서 커밋해주세요.

- 푸시 (현재 **feature/issue-번호** 브랜치)

```
git push origin feature/issue-번호 브랜치
```

- feature/기능 이슈 번호 브랜치에서 할 일 다 헀으면 pr에서 머지 후 **development** 브랜치로 전환

```
git checkout development
```

- 다 쓴 브랜치 삭제 (local) (현재 **development** 브랜치)

```
git branch -d feature/issue-번호
```

- 다 쓴 브랜치 삭제 (remote) (현재 **development** 브랜치)

```
git push origin :feature/issue-번호
```

- development pull (현재 **development** 브랜치)

```
git pull origin development
```

- 최신 development 커밋 반영 rebase

```
git rebase development
git status
-> conflict 있으면 해결

해결한 파일마다 git add services/UserService 와 같은 방식으로 add
git rebase --continue (다 반영했으면 다음 conflict로 넘어감)
```

## 🏹 Dependencies module

```json
{
  "name": "handycandy",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "ts-node src",
    "build": "tsc && node dist",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@commitlint/cli": "^12.1.4",
    "@commitlint/config-conventional": "^12.1.4",
    "@types/node": "^15.12.5",
    "@typescript-eslint/eslint-plugin": "^4.28.1",
    "@typescript-eslint/parser": "^4.28.1",
    "eslint": "^7.29.0",
    "eslint-config-airbnb-base": "^14.2.1",
    "eslint-config-prettier": "^8.3.0",
    "eslint-plugin-import": "^2.23.4",
    "eslint-plugin-prettier": "^3.4.0",
    "husky": "^7.0.0",
    "lint-staged": "^11.0.0",
    "prettier": "2.3.2",
    "ts-node": "^10.0.0",
    "typescript": "^4.3.4"
  },
  "dependencies": {
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "mongoose": "^5.12.15"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "**/*.{js,ts}": "eslint"
  }
}
```

# 📧API 명세서

[API 명세서 링크](https://www.notion.so/Dev-Wiki-80bcbd2e849c4b7cb53db0c358e06364)

## 👨‍👧‍👧역할 분담
