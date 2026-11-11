# Xuat checklist.xlsx ra checklist.md (bang day du + thong ke theo IA)
# Cach dung (tu thu muc hw03 trong repo): python tools/export_checklist_md.py
import openpyxl, collections

ws = openpyxl.load_workbook('checklist.xlsx')['Checklist']
rows = list(ws.iter_rows(values_only=True))[1:]


def cell(v):
    return str(v or '').replace('|', r'\|').replace('\n', ' ')


ia = collections.defaultdict(collections.Counter)
src = collections.Counter()
for r in rows:
    ia[r[1]][r[7]] += 1
    src['AI' if r[0].startswith('IA') else 'Tuệ bổ sung'] += 1
P = sum(1 for r in rows if r[7] == 'Pass')
F = len(rows) - P
L = ['# GUI Checklist – Đăng ký / Đăng nhập / Quên mật khẩu / Hồ sơ (EShop)', '',
     f'**Tổng:** {len(rows)} mục · **Passed:** {P} · **Failed:** {F} · AI sinh: {src["AI"]} · Tuệ bổ sung: {src["Tuệ bổ sung"]}', '',
     'Bản gốc: `checklist.xlsx` (sheet "Checklist" + "Ghi chú chạy"). Ảnh chỉ cho mục Failed, trong `screenshots/`.', '',
     '| IA | Tổng | Passed | Failed |', '|---|---|---|---|']
for k in sorted(ia):
    L.append(f'| {k} | {sum(ia[k].values())} | {ia[k]["Pass"]} | {ia[k]["Fail"]} |')
L += ['', '| ID | IA | Màn | Việc kiểm tra | Kết quả mong đợi | Nguồn | Lý do AI bỏ sót | Kết quả | Notes | Ảnh |', '|' + '---|' * 10]
for r in rows:
    img = f'[{r[9]}](screenshots/{r[9]})' if r[9] else ''
    res = '✅ Pass' if r[7] == 'Pass' else '❌ Fail'
    L.append('| ' + ' | '.join(cell(x) for x in r[:7]) + f' | {res} | {cell(r[8])} | {img} |')
open('checklist.md', 'w', encoding='utf-8').write('\n'.join(L) + '\n')
print(len(rows), P, F, dict(src))
