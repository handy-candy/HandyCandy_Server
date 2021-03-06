![img](<https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F23f4183d-c084-4f28-864c-6055a1a20fa0%2F___(5).png?table=block&id=7c43a727-0962-4c7f-ad67-1a6f9dece6ae&spaceId=cc4e63fe-9341-442b-823d-efdb19e51566&width=3070&userId=898bd393-2284-49ba-adb6-daa3f952d4b0&cache=v2>)

# π­ Project

- λ°μ νλμΈλ€μ μν΄ λλ§μ λ³΄μμ μ μ¬νλ **λ³΄μ μμΉ΄μ΄λΉ μλΉμ€**

  μ½κ² μ μ₯νκ³ ! λ΄κ° μνλ λλ‘ λͺ¨μΌκ³ ! λ³΄μμ κ³¨λΌ κΈ°λ€λ¦¬λ μ€λ κΉμ§!

  μμλ λλ₯Ό μν μκ°μ νΈλμΊλλ‘ μμκ°μΈμ.

  λ³΄μ, λ³΄μλ  μ μ₯-μν  λ μ΄λ κ°λ₯-λ³΄μμ ν΅ν λ§μ‘±κ°

- **SOPT 28th APPJAM, HANDY-CANDY**

- νλ‘μ νΈ κΈ°κ°: 2021.06.26~2021.07.17

> λ΄ μ μμ λ¬μ½€ν λ³΄μ, HANDY-CANDY

# β¨ Base URL
### https://handycandy.cf

<br>

# π Server Architecture

![image](https://user-images.githubusercontent.com/58697091/125952504-b70023ea-0736-41a2-99e3-d7dbb7c3a97a.png)

# π  κ°λ° νκ²½

![img](https://img.shields.io/badge/typescript-4.3.4-blue)
![img](https://img.shields.io/badge/ts--node-10.0.0-green)
![img](https://img.shields.io/badge/eslint-4.28.1-white)
![img](https://img.shields.io/badge/commitlint-12.1.4-black)
![img](https://img.shields.io/badge/prettier-2.3.2-red)
![img](https://img.shields.io/badge/husky-7.0.0-yellow)
![img](https://img.shields.io/badge/nginx-green)
![img](https://img.shields.io/badge/docker-blue)


# π§API λͺμΈμ

[API λͺμΈμ λ§ν¬](https://www.notion.so/Dev-Wiki-80bcbd2e849c4b7cb53db0c358e06364)

<br>

![Desktop - 1](https://user-images.githubusercontent.com/57944153/123970621-3d61cf80-d9f4-11eb-90db-2ad8f549354f.png)



# π ERD Diagram

<img src="https://user-images.githubusercontent.com/57944153/125957828-53e4e31f-408c-4528-b1fc-6948c2ebdb26.png" width="100%">

# π Coding Convention

### π ν΄λκ΅¬μ‘°

- src
  - Logger
  - api
  - config
  - interfaces
  - middleware
  - models
  - jobs
  - services
  - controllers
- Dockerfile
- eslint
- prettierrc
- commitlint
- tsconfig

### **π λ€μ΄λ°**

**Class & Constructor**

- ν΄λμ€/μμ±μ μ΄λ¦μ **UpperCamelCase**λ₯Ό μ¬μ©ν©λλ€.
- κΈμμ κΈΈμ΄λ 20μ μ΄λ΄λ‘ μ νν©λλ€.

μ’μ μ >

```typescript
  class HandyCandy
```

λμ μ >

```typescript
  class handycandy {}
```

**ν¨μ & λ³μ & μΈμ€ν΄μ€**

- ν¨μμ λ³μ, μΈμ€ν΄μ€μλ **lowerCamelCase**λ₯Ό μ¬μ©ν©λλ€.

### **π· μ£Όμ**

- `// MARK:` λ₯Ό μ¬μ©ν΄μ μ°κ΄λ μ½λλ₯Ό κ΅¬λΆμ§μ΅λλ€.
- `/** */` λ₯Ό μ¬μ©ν΄μ μ½λ μμ±μμ μ΄λ¦μ λͺμν©λλ€.

### **π κΈ°ν**

- , λ€μ λ°λμ λμ΄μ°κΈ°λ₯Ό ν©λλ€.
- ν¨μλΌλ¦¬ 1μ€ κ°νν©λλ€.
- μ€κ΄νΈλ μλμ κ°μ νμμΌλ‘ μ¬μ©ν©λλ€.

```typescript
if (condition) {
  Statements;
  /*
  ...
  */
}
```

<br>

# βοΈ Commit Messge Rules

**μλ²μΊλ** λ€μ **Git Commit Message Rules**

- λ°μμ¬ν­μ λ°λ‘ νμΈν  μ μλλ‘ μμ κΈ°λ₯ νλλΌλ κ΅¬νλλ©΄ μ»€λ°μ κΆμ₯ν©λλ€.
- μ»€λ°ν  λ **μλ²μ¬λμ λΈν°**, **pr νμ, review request νμ**μλλ€.
- κΈ°λ₯ κ΅¬νμ΄ μλ²½νμ§ μμ λ, κ°μ λΈλμΉμ μ»€λ°μ ν΄μ£ΌμΈμ.

### **π μ»€λ° λ©μμ§ λͺλ Ήμ΄ λͺ¨μ**

    μ»€λ° κ·μΉμ μ§ν€μ§ μμΌλ©΄ commitlintμμ μλμΌλ‘ μλ¬κ° λ°μν©λλ€.

```
- feat    : κΈ°λ₯ (μλ‘μ΄ κΈ°λ₯)
- fix     : λ²κ·Έ (λ²κ·Έ μμ )
- refactor: λ¦¬ν©ν λ§
- style   : μ€νμΌ (μ½λ νμ, μΈλ―Έμ½λ‘  μΆκ°: λΉμ¦λμ€ λ‘μ§μ λ³κ²½ μμ)
- docs    : λ¬Έμ (λ¬Έμ μΆκ°, μμ , μ­μ )
- test    : νμ€νΈ (νμ€νΈ μ½λ μΆκ°, μμ , μ­μ : λΉμ¦λμ€ λ‘μ§μ λ³κ²½ μμ)
- chore   : κΈ°ν λ³κ²½μ¬ν­ (λΉλ μ€ν¬λ¦½νΈ μμ  λ±)
```

### **βΉοΈ μ»€λ° λ©μΈμ§ νμ**

- `μ»€λ°λ©μΈμ§: μ€λͺ` νμμΌλ‘ μ»€λ° λ©μμ§λ₯Ό μμ±ν©λλ€.
- μ»€λ° μ€λͺμ λ¬΄μ‘°κ±΄ μμ΄λ‘ νλ€κ³  μ’μκ² μλλλ€.
- μ΅λν λ΄μ© ν¬ν¨κ³Ό μμΈν μλ‘ μ’μ΅λλ€.
- νμ§λ§ λλ¬΄ κΈΈκ²λ μλ©λλ€.

μ’μ μ >

```
  feat: search api μΆκ°
```

λμ μ >

```
  κ²μ api μΆκ°
```

μ’μ μ >

```
  test: νμκ°μ λ‘μ§ test code μμ±
```

λμ μ >

```
  test code μμ±,
  test: test code μμ±
```


<br>


## **π» Github mangement**

**μλ²μΊλ** λ€μ WorkFlow : **Gitflow Workflow**

- Mainκ³Ό Develop λΈλμΉ

  λ©μΈ(main): λ©μΈ λΈλμΉ -> product

  κ°λ°(development): κΈ°λ₯λ€μ ν΅ν© λΈλμΉ μ­ν βοΈ μ΄ λΈλμΉμμ κΈ°λ₯λ³λ‘ λΈλμΉλ₯Ό λ° λͺ¨λ  κ΅¬νμ΄ μ΄λ£¨μ΄μ§λλ€. -> alpha

- Mainμ μ§μ μ μΈ commit, pushλ κ°κΈμ  κΈμ§ν©λλ€. (X)

- μ»€λ° λ©μΈμ§λ λ€λ₯Έ μ¬λλ€μ΄ λ΄λ μ΄ν΄ν  μ μκ² μ¨μ£ΌμΈμ.

- νλ¦¬νμ€νΈλ₯Ό ν΅ν΄ μ½λ λ¦¬λ·°λ₯Ό ν΄λ³΄μμ.

```
developmentμ λ°λ‘ mergeνμ§ μμ΅λλ€.
prμ developmentλ‘ ν΄μ£ΌμΈμ.
developmentμμ μμ±μ΄ λλ©΄ mainμΌλ‘ κ·Έλ κ·Έλ mergeν©λλ€.

mergeλ githubμμ μ§νν©λλ€.
merge pull request κΈμ§ -> squash and merge ν΄λ¦­
rebase λλ conflict ν΄κ²°μ githubμμ νμ§ μμ΅λλ€.

local codeμμ git statusλ‘ νμΈν΄κ°λ©° μ μ© ν force push μ§νν©λλ€.
force push μ λ§ μ‘°μ¬ν΄μ£ΌμΈμ.
```

<img src="https://camo.githubusercontent.com/5af55d4c184cd61dabf0747bbf9ebc83b358eccb/68747470733a2f2f7761632d63646e2e61746c61737369616e2e636f6d2f64616d2f6a63723a62353235396363652d363234352d343966322d623839622d3938373166396565336661342f30332532302832292e7376673f63646e56657273696f6e3d393133" width="80%">

**μ΄μ μ°λ λ°©λ²**

- μ΄μ μμ±

  ```
  Githubμ issue ν­μ λ€μ΄κ°μ κΈ°λ₯ μ μμλ₯Ό κΈ°λ°μΌλ‘ issueλ₯Ό μμ±ν©λλ€.
  commit message rulesμ λμΌνκ² μ΄μλ₯Ό μμ±ν΄μ£ΌμΈμ.
  μ΄μλ₯Ό μμ±νλ©΄ μλμΌλ‘ λ²νΈκ° λ°κΈλ©λλ€. μ΄ λ²νΈλ₯Ό μ¬μ©νμ¬ feature λΈλμΉλ₯Ό μμ±ν©λλ€.
  ```

- λΈλμΉλ₯Ό μμ±νμ¬ ν΄λΉ λΈλμΉμ commit, push ν©λλ€.

- PRμ λ λ¦΄ λ μμ±μμ λ¦¬λ·°μ΄λ₯Ό μ€μ ν©λλ€.

- μ΄ λ **resolved #μ΄μλ²νΈ**λ‘ μμ±νλ©΄ mergeλ  λ ν΄λΉ issueλ μλ μ­μ λ©λλ€.

- μ΄λ κ² PRμ΄ μμ±λλ©΄ μλ‘μ΄ issueλ²νΈκ° λΆμ¬λ©λλ€. μ¦, **PRλ issueμλλ€.**

  

**κ°μ μμ μ΄ λ§‘μ κΈ°λ₯ κ΅¬νμ μ±κ³΅μ! λΈλμΉ λ€ μ°κ³  λ³ν©νλ λ°©λ²**

- λΈλμΉ λ§λ¦

```
git branch feature/issue-λ²νΈ
```

- λΈλμΉ μ ν

```
git checkout feature/issue-λ²νΈ
```

- λΈλμΉ λ§λ¦κ³Ό λμμ μ ν

```
git checkout -b feature/issue-λ²νΈ
```

- μ½λ λ³κ²½ (νμ¬ **feature/issue-λ²νΈ** λΈλμΉ)

```
git add .
git commit -m "μ»€λ° λ©μΈμ§" -a // μ΄μλ³΄λ μ΄λ¦λλ‘ μ»€λ°
```

    - git add . λ₯Ό κΈ°λ₯λ³λ‘ λͺ¨μλκ² μλλΌλ©΄ μμ£Ό μ°μ§ λ§μμ£ΌμΈμ.
    
    - ν΄λΉ κΈ°λ₯λΌλ¦¬ λ¬Άμ΄μ μ»€λ°ν΄μ£ΌμΈμ.

- νΈμ (νμ¬ **feature/issue-λ²νΈ** λΈλμΉ)

```
git push origin feature/issue-λ²νΈ λΈλμΉ
```

- feature/κΈ°λ₯ μ΄μ λ²νΈ λΈλμΉμμ ν  μΌ λ€ νμΌλ©΄ prμμ λ¨Έμ§ ν **development** λΈλμΉλ‘ μ ν

```
git checkout development
```

- λ€ μ΄ λΈλμΉ μ­μ  (local) (νμ¬ **development** λΈλμΉ)

```
git branch -d feature/issue-λ²νΈ
```

- λ€ μ΄ λΈλμΉ μ­μ  (remote) (νμ¬ **development** λΈλμΉ)

```
git push origin :feature/issue-λ²νΈ
```

- development pull (νμ¬ **development** λΈλμΉ)

```
git pull origin development
```

- μ΅μ  development μ»€λ° λ°μ rebase

```
git rebase development
git status
-> conflict μμΌλ©΄ ν΄κ²°

ν΄κ²°ν νμΌλ§λ€ git add services/UserService μ κ°μ λ°©μμΌλ‘ add
git rebase --continue (λ€ λ°μνμΌλ©΄ λ€μ conflictλ‘ λμ΄κ°)
```

<br>


## πΉ Dependencies module

```json
{
  "name": "handycandy",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "ts-node src",
    "start": "tsc && node dist",
    "build": "tsc && node dist",
    "test": "echo \"Error: no test specified\" && exit 1",
    "postinstall": "husky install"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@commitlint/cli": "^12.1.4",
    "@commitlint/config-conventional": "^12.1.4",
    "@types/cors": "^2.8.12",
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
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.5",
    "cors": "^2.8.5",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "express-validator": "^6.12.0",
    "gravatar": "^1.8.1",
    "jsonwebtoken": "^8.5.1",
    "moment": "^2.29.1",
    "moment-timezone": "^0.5.33",
    "mongoose": "^5.12.15",
    "nodemailer": "^6.6.2",
    "nodemailer-smtp-transport": "^2.7.4"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "commitlint": {
    "extends": [
      "@commitlint/config-conventional"
    ]
  },
  "lint-staged": {
    "**/*.{js,ts}": "eslint"
  }
}

```

<br>