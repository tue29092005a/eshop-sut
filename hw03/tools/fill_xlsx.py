import json, openpyxl
from openpyxl.styles import Alignment, Font
R=json.load(open('tools/checklist_results.json',encoding='utf-8'))
p='eshop-sut/hw03/checklist.xlsx'
wb=openpyxl.load_workbook(p); ws=wb['Checklist']
ids={ws.cell(r,1).value:r for r in range(2,ws.max_row+1)}
if 'ADD-16' not in ids:
    ws.append(['ADD-16','IA-04 Phản hồi/Trạng thái','Hồ sơ','Sau khi cập nhật hồ sơ, họ tên trên header được cập nhật ngay','Header "Chào, <tên mới>" đổi ngay sau khi cập nhật thành công (không cần đăng xuất/đăng nhập lại)','Tuệ','Lỗi trạng thái xuất hiện sau thao tác thật (cập nhật xong rồi nhìn header); AI sinh mục theo prompt từng IA, không chạy luồng cập nhật nên không thấy.','','',''])
    ids['ADD-16']=ws.max_row
    for c in ws[ws.max_row]: c.alignment=Alignment(wrap_text=True,vertical='top')
n=0
for k,v in R.items():
    if not v or k not in ids: continue
    r=ids[k]; ws.cell(r,8).value=v['r']; ws.cell(r,9).value=v['n']
    ws.cell(r,10).value=v['s'] if v['r']=='Fail' else None
    for c in (8,9,10): ws.cell(r,c).alignment=Alignment(wrap_text=True,vertical='top')
    n+=1
missing=[i for i in ids if not R.get(i)]
print('filled',n,'missing',missing)
from openpyxl.worksheet.datavalidation import DataValidation
ws.data_validations.dataValidation=[]
dv=DataValidation(type='list',formula1='"Pass,Fail"',allow_blank=True); ws.add_data_validation(dv); dv.add(f'H2:H{ws.max_row}')
ws.auto_filter.ref=ws.dimensions
if 'Ghi chú chạy' in wb.sheetnames: del wb['Ghi chú chạy']
s=wb.create_sheet('Ghi chú chạy')
for line in ['Cách chạy: script tools/run_checklist.js (Playwright, Chromium headless, Windows 11) chạy trên SUT local; DB reset bằng node database.js trước khi chạy.',
 'Kết quả và ghi chú do script ghi tự động; Tuệ cần kiểm tra lại từng mục trước khi nộp (cột Kết quả/Notes).',
 'Ảnh trong thư mục screenshots/: thanh đen phía trên (URL, trình duyệt, giờ) là banner do script chèn vào ảnh, KHÔNG phải thanh địa chỉ thật của trình duyệt. Với bản nộp cuối nên chụp lại bằng Chrome thật nếu đề yêu cầu thấy thanh URL.',
 'alert() là hộp thoại gốc của trình duyệt, không xuất hiện trong ảnh chụp trang; các mục liên quan có ảnh bằng chứng dạng bản ghi (nội dung alert ghi trong ảnh và Notes).',
 'Ảnh dạng bản ghi API/DOM (ADD-02, 04, 05, 10, 15, IA04-04, 08, 11, 12) là trang dựng lại từ kết quả đo thật, không phải ảnh chụp giao diện; ADD-14 dùng ảnh DevTools Tuệ đã chụp (B14-login-response.png).',
 'Mục IA02-16, IA03-09, IA03-12, ADD-06, ADD-07 là đánh giá chủ quan của người chạy, cần Tuệ xem lại.',
 'Mục IA01-14: kết quả phụ thuộc locale trình duyệt (đã chạy với en-US).',
 'Mục IA03-11/ADD-09: thứ tự Tab đo bằng cách bấm Tab từ đầu trang; Sign In đứng ĐẦU (tabIndex=1). Tuệ quan sát thấy Sign In đứng cuối khi đã bấm vào ô trước, hai kết quả khác điểm bắt đầu.']:
    s.append([line])
s.column_dimensions['A'].width=150
for r in s.iter_rows():
    r[0].alignment=Alignment(wrap_text=True,vertical='top')
wb.save(p)
