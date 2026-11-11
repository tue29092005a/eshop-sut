# Tao cross_platform/cross_platform_results.xlsx tu checklist.xlsx: moi muc 1 dong, 3 cot ket qua cho 3 nen tang.
# Cach dung (tu thu muc hw03): python tools/build_cross_platform.py
import openpyxl
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.worksheet.datavalidation import DataValidation

PLATFORMS = ['Chrome / Windows 11 (BrowserStack)', 'Firefox / Windows 11 (BrowserStack)', 'Safari / macOS (BrowserStack)']
# Muc chi kiem qua API/DB: ket qua khong phu thuoc trinh duyet -> ghi "Giong nhau" thay vi chay lai
API_ONLY = {'IA04-04': 'Đếm login_attempts trong DB', 'ADD-14': 'Payload API', 'ADD-15': 'Gọi API trực tiếp'}

src = openpyxl.load_workbook('checklist.xlsx')['Checklist']
rows = list(src.iter_rows(values_only=True))[1:]
wb = openpyxl.Workbook(); ws = wb.active; ws.title = 'Cross-platform'
hdr = ['ID', 'IA', 'Màn', 'Việc kiểm tra', 'Kết quả mong đợi', 'Task 1 (Chromium headless)'] + \
      [f'{p} – Kết quả' for p in PLATFORMS] + ['Khác biệt giữa nền tảng / Notes', 'Ảnh (chỉ khi Fail hoặc khác biệt)']
ws.append(hdr)
for r in rows:
    note = API_ONLY.get(r[0])
    res = ['Giống nhau (API)'] * 3 if note else [''] * 3
    ws.append([r[0], r[1], r[2], r[3], r[4], r[7]] + res + [f'{note}: không phụ thuộc trình duyệt' if note else '', ''])
for c in ws[1]:
    c.font = Font(bold=True, color='FFFFFF'); c.fill = PatternFill('solid', fgColor='1F2937')
    c.alignment = Alignment(wrap_text=True, vertical='center')
for col, w in zip('ABCDEFGHIJK', [9, 16, 14, 40, 40, 12, 16, 16, 16, 40, 24]):
    ws.column_dimensions[col].width = w
for row in ws.iter_rows(min_row=2):
    for c in row: c.alignment = Alignment(wrap_text=True, vertical='top')
dv = DataValidation(type='list', formula1='"Pass,Fail,Giống nhau (API),Không áp dụng"', allow_blank=True)
ws.add_data_validation(dv); dv.add(f'G2:I{ws.max_row}')
ws.freeze_panes = 'B2'; ws.auto_filter.ref = ws.dimensions

s = wb.create_sheet('Tổng hợp')
s.append(['Nền tảng', 'Số mục', 'Pass', 'Fail', 'Giống nhau (API)', 'Chưa chạy'])
n = ws.max_row
for i, col in enumerate('GHI'):
    s.append([PLATFORMS[i], n - 1, f'=COUNTIF(\'Cross-platform\'!{col}2:{col}{n},"Pass")',
              f'=COUNTIF(\'Cross-platform\'!{col}2:{col}{n},"Fail")',
              f'=COUNTIF(\'Cross-platform\'!{col}2:{col}{n},"Giống nhau (API)")',
              f'=COUNTBLANK(\'Cross-platform\'!{col}2:{col}{n})'])
for c in s[1]: c.font = Font(bold=True)
s.column_dimensions['A'].width = 38
wb.save('cross_platform/cross_platform_results.xlsx')
print('rows', n - 1)
