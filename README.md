# How to Start GoWhere

## 개발 환경 (Development)

개발 환경에서는 Docker를 이용해 백엔드와 프론트를 실시간으로 개발할 수 있습니다. <br><br>
프론트 수정의 경우 **Hot Reload** 되어 적용됩니다.<br>
백엔드 수정의 경우 수정후 **up 명령어**를 이용해 컨테이너를 재실행 해주세요.

### 최초 실행

개발 환경에서 프로젝트를 처음 실행할 때:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### 두번쨰 실행 이후

이미 빌드된 이미지가 있는 경우, 컨테이너를 바로 실행

```bash
docker-compose -f docker-compose.dev.yml up
```

### 시스템 종료

로컬 개발 서버 종료

- Windows / Linux : Ctrl + C
- macOS : Cmd + C

Docker 컨테이너 종료:
```bash
docker-compose -f docker-compose.dev.yml down
```

### 데이터베이스 초기화

DB와 관련된 볼륨을 삭제하고 새로 시작하려면:

```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up --build
```

### IF 로컬 Postgresql이 실행중이라면...

Docker 컨테이너에서 같은 포트를 사용할 수 없으므로 기존 프로세스를 종료해주세요:
```bash
# Window
netstat -ano | findstr 5432
taskkill /PID <PID번호> /F

# Mac
lsof -i :5432
kill -9 <PID>
```
프론트와 백엔드 역시 로컬에서 같은 포트를 사용중이라면 위 명령어를 포트번호만 바꿔서 실행해주세요.
## 배포 환경 (Production)

배포 환경에서는 기본 docker-compose.yml을 사용하며, 새로 빌드 후 실행:

```bash
docker-compose up --build
```

나머지 명령어도 docker-compose 사용해주세요.