# development testing checklist

- [x] `npm run test:api:health`
- [x] `npm run test:api:pr-feed` 
- [x] `npm run test:api:pr-detail`
- [ ] `npm run test:web:health` (nice to have)
- [ ] `npm run test:web:landing` (nice to have)
- [x] `npm run test:web:pr-feed` 
- [x] `npm run test:web:pr-detail`

# production branch testing checklist

- [x] `npm run test:prod-branch:api:health` (✅ Fixed - now accepts 'ok' and 'warning' statuses)
- [x] `npm run test:prod-branch:api:pr-feed` (✅ Fixed - added per_page validation and capping at 50)
- [ ] `npm run test:prod-branch:api:pr-detail`
- [ ] `npm run test:prod-branch:web:landing`
- [ ] `npm run test:prod-branch:web:pr-feed`
- [ ] `npm run test:prod-branch:web:pr-detail`

# production main testing checklist

- [ ] `npm run test:prod-main:web:landing`
- [ ] `npm run test:prod-main:web:pr-feed`
- [ ] `npm run test:prod-main:web:pr-detail`