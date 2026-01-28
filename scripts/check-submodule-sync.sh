#!/bin/bash

# Скрипт для перевірки синхронізації гілок між pdf-validator та validator субмодулем

set -e  # Вийти при помилці

# Кольори для виводу
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   📊 Перевірка синхронізації субмодуля validator${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Перевірка що ми в правильній директорії
if [ ! -f "package.json" ] || [ ! -d "src/validator" ]; then
    echo -e "${RED}❌ Помилка: Запустіть скрипт з кореня pdf-validator repository!${NC}"
    exit 1
fi

# Отримати поточну гілку pdf-validator
PDF_BRANCH=$(git branch --show-current)
echo -e "${BLUE}📍 pdf-validator гілка:${NC} ${GREEN}$PDF_BRANCH${NC}"

# Перевірити чи субмодуль ініціалізований
if [ ! -d "src/validator/.git" ]; then
    echo -e "${YELLOW}⚠️  Субмодуль не ініціалізований!${NC}"
    echo ""
    read -p "Ініціалізувати субмодуль? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git submodule update --init --recursive
        echo -e "${GREEN}✅ Субмодуль ініціалізовано${NC}"
    else
        exit 1
    fi
fi

# Перейти в субмодуль і отримати інформацію
cd src/validator

# Отримати поточну гілку validator
VALIDATOR_BRANCH=$(git branch --show-current)
echo -e "${BLUE}🔗 validator гілка:${NC}     ${GREEN}$VALIDATOR_BRANCH${NC}"

# Отримати версії
cd ../..
PDF_VERSION=$(cat package.json | grep '"version"' | head -1 | sed 's/.*: "\(.*\)".*/\1/')
VALIDATOR_VERSION=$(cat src/validator/package.json | grep '"version"' | head -1 | sed 's/.*: "\(.*\)".*/\1/')

echo ""
echo -e "${BLUE}📦 pdf-validator версія:${NC} ${GREEN}$PDF_VERSION${NC}"
echo -e "${BLUE}📦 validator версія:${NC}     ${GREEN}$VALIDATOR_VERSION${NC}"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Перевірка 1: Синхронізація гілок
echo -e "\n${BLUE}🔍 Перевірка 1: Синхронізація гілок${NC}"
if [ "$PDF_BRANCH" = "$VALIDATOR_BRANCH" ]; then
    echo -e "${GREEN}✅ Гілки синхронізовані!${NC}"
    BRANCH_SYNC=true
else
    echo -e "${RED}❌ ПОМИЛКА: Гілки НЕ співпадають!${NC}"
    echo ""
    echo -e "${YELLOW}Рекомендація:${NC}"
    echo "  cd src/validator"
    echo "  git checkout $PDF_BRANCH"
    echo "  cd ../.."
    echo "  git add src/validator"
    echo "  git commit -m 'chore: sync validator to $PDF_BRANCH branch'"
    BRANCH_SYNC=false
fi

# Перевірка 2: Синхронізація версій
echo -e "\n${BLUE}🔍 Перевірка 2: Синхронізація версій${NC}"
if [ "$PDF_VERSION" = "$VALIDATOR_VERSION" ]; then
    echo -e "${GREEN}✅ Версії синхронізовані!${NC}"
    VERSION_SYNC=true
else
    echo -e "${YELLOW}⚠️  Версії відрізняються${NC}"
    echo ""
    echo -e "${YELLOW}Це нормально якщо:${NC}"
    echo "  - Validator має окрему логіку версіонування"
    echo "  - Версії незалежні (не обов'язково синхронізовані)"
    echo ""
    echo -e "${YELLOW}Якщо версії мають бути однакові:${NC}"
    echo "  cd src/validator"
    echo "  npm version $PDF_VERSION --no-git-tag-version"
    echo "  git add package.json"
    echo "  git commit -m 'chore: sync version to $PDF_VERSION'"
    echo "  git push origin $VALIDATOR_BRANCH"
    echo "  cd ../.."
    echo "  git add src/validator"
    echo "  git commit -m 'chore: update validator to v$PDF_VERSION'"
    VERSION_SYNC=false
fi

# Перевірка 3: Незакомічені зміни в субмодулі
echo -e "\n${BLUE}🔍 Перевірка 3: Статус субмодуля${NC}"
cd src/validator
SUBMODULE_STATUS=$(git status --porcelain)
cd ../..

if [ -z "$SUBMODULE_STATUS" ]; then
    echo -e "${GREEN}✅ Немає незакомічених змін в субмодулі${NC}"
    SUBMODULE_CLEAN=true
else
    echo -e "${YELLOW}⚠️  Є незакомічені зміни в validator:${NC}"
    cd src/validator
    git status --short
    cd ../..
    echo ""
    echo -e "${YELLOW}Рекомендація:${NC}"
    echo "  cd src/validator"
    echo "  git add ."
    echo "  git commit -m 'fix: commit changes'"
    echo "  git push origin $VALIDATOR_BRANCH"
    SUBMODULE_CLEAN=false
fi

# Перевірка 4: Субмодуль оновлений в pdf-validator
echo -e "\n${BLUE}🔍 Перевірка 4: Статус субмодуля в pdf-validator${NC}"
MAIN_STATUS=$(git status --porcelain src/validator)

if [ -z "$MAIN_STATUS" ]; then
    echo -e "${GREEN}✅ Субмодуль закомічений в pdf-validator${NC}"
    MAIN_CLEAN=true
else
    echo -e "${YELLOW}⚠️  Субмодуль має зміни в pdf-validator:${NC}"
    git status --short src/validator
    echo ""
    echo -e "${YELLOW}Рекомендація:${NC}"
    echo "  git add src/validator"
    echo "  git commit -m 'chore: update validator submodule'"
    echo "  git push origin $PDF_BRANCH"
    MAIN_CLEAN=false
fi

# Перевірка 5: Remote URL
echo -e "\n${BLUE}🔍 Перевірка 5: Remote URL субмодуля${NC}"
cd src/validator
REMOTE_URL=$(git remote get-url origin)
cd ../..

EXPECTED_URL="https://github.com/victorchei/validator.git"
if [ "$REMOTE_URL" = "$EXPECTED_URL" ]; then
    echo -e "${GREEN}✅ Remote URL коректний: $REMOTE_URL${NC}"
    REMOTE_OK=true
else
    echo -e "${RED}❌ Неочікуваний remote URL: $REMOTE_URL${NC}"
    echo -e "${YELLOW}Очікується: $EXPECTED_URL${NC}"
    REMOTE_OK=false
fi

# Підсумок
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   📊 Підсумок${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

ALL_OK=true

if [ "$BRANCH_SYNC" = true ]; then
    echo -e "${GREEN}✅${NC} Гілки синхронізовані"
else
    echo -e "${RED}❌${NC} Гілки не синхронізовані"
    ALL_OK=false
fi

if [ "$VERSION_SYNC" = true ]; then
    echo -e "${GREEN}✅${NC} Версії синхронізовані"
else
    echo -e "${YELLOW}⚠️${NC}  Версії відрізняються"
fi

if [ "$SUBMODULE_CLEAN" = true ]; then
    echo -e "${GREEN}✅${NC} Субмодуль чистий"
else
    echo -e "${YELLOW}⚠️${NC}  Є зміни в субмодулі"
    ALL_OK=false
fi

if [ "$MAIN_CLEAN" = true ]; then
    echo -e "${GREEN}✅${NC} pdf-validator чистий"
else
    echo -e "${YELLOW}⚠️${NC}  Потрібно оновити субмодуль"
    ALL_OK=false
fi

if [ "$REMOTE_OK" = true ]; then
    echo -e "${GREEN}✅${NC} Remote URL коректний"
else
    echo -e "${RED}❌${NC} Remote URL некоректний"
    ALL_OK=false
fi

echo ""
if [ "$ALL_OK" = true ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}   ✅ ВСЕ ПЕРЕВІРКИ ПРОЙДЕНО!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 0
else
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}   ⚠️  ЗНАЙДЕНО ПРОБЛЕМИ - ПЕРЕГЛЯНЬТЕ РЕКОМЕНДАЦІЇ${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 1
fi
