# development testing checklist

- [x] `npm run test:api:health`
- [x] `npm run test:api:pr-feed` ✅ **PASSED** (5/5 tests, 100% success rate) - ✨ **CLEAN OUTPUT** (Fixed verbose error logging)
- [x] `npm run test:api:pr-detail`
- [ ] `npm run test:web:health`
- [ ] `npm run test:web:landing`
- [ ] `npm run test:web:pr-feed`
- [ ] `npm run test:web:pr-detail`

# production branch testing checklist

- [ ] `npm run test:prod-branch:api:health`
- [ ] `npm run test:prod-branch:api:pr-feed`
- [ ] `npm run test:prod-branch:api:pr-detail`
- [ ] `npm run test:prod-branch:web:landing`
- [ ] `npm run test:prod-branch:web:pr-feed`
- [ ] `npm run test:prod-branch:web:pr-detail`

# production main testing checklist

- [ ] `npm run test:prod-main:web:landing`
- [ ] `npm run test:prod-main:web:pr-feed`
- [ ] `npm run test:prod-main:web:pr-detail`