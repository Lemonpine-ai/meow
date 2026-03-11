# VoiMeow 자동 커밋 & 푸시 스크립트
# 사용법: .\auto-commit.ps1 "커밋 메시지"
# 예시:   .\auto-commit.ps1 "네비게이션 스타일 수정"

param(
    [string]$commitMessage = "자동 커밋 - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " VoiMeow 자동 커밋 & 푸시 시작" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 스크립트가 있는 폴더를 작업 디렉토리로 설정
Set-Location $PSScriptRoot

# 변경사항 확인
$statusOutput = git status --porcelain
if (-not $statusOutput) {
    Write-Host "[알림] 변경된 파일이 없습니다. 커밋을 건너뜁니다." -ForegroundColor Yellow
    exit 0
}

Write-Host "`n[1/4] 변경된 파일 목록:" -ForegroundColor Green
git status --short

# git add
Write-Host "`n[2/4] 파일 스테이징 중..." -ForegroundColor Green
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "[오류] git add 실패" -ForegroundColor Red
    exit 1
}
Write-Host "      완료" -ForegroundColor Green

# git commit
Write-Host "`n[3/4] 커밋 중: '$commitMessage'" -ForegroundColor Green
git commit -m $commitMessage
if ($LASTEXITCODE -ne 0) {
    Write-Host "[오류] git commit 실패" -ForegroundColor Red
    exit 1
}
Write-Host "      완료" -ForegroundColor Green

# git push (토큰은 git config에 저장된 remote URL 사용)
Write-Host "`n[4/4] GitHub에 푸시 중..." -ForegroundColor Green
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "[오류] git push 실패" -ForegroundColor Red
    Write-Host "       토큰이 만료되었을 수 있습니다." -ForegroundColor Yellow
    Write-Host "       다음 명령어로 토큰을 갱신하세요:" -ForegroundColor Yellow
    Write-Host "       git remote set-url origin https://Lemonpine-ai:[새토큰]@github.com/Lemonpine-ai/meow.git" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " 완료! GitHub에 성공적으로 업로드됨" -ForegroundColor Cyan
Write-Host " https://github.com/Lemonpine-ai/meow" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
