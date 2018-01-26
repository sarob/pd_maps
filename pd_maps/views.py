
from django.shortcuts import get_object_or_404, render, redirect
from django.http import JsonResponse

from django.conf import settings
import os

import csv

from django.templatetags.static import static

def get_maps(request):
    return render(request, 'pd_maps/map.html')

def toNumber(str_num):
    return int(str_num.replace(',', ''))

def plot(request, name):

    # file_path = static('CalPERS_Actuarial_Report_Data_01232018.xlsx')
    # file_path = 'http://' + request.get_host() + settings.STATIC_URL + 'CalPERS_Actuarial_Report_Data_01232018.xlsx'
    # print (file_path)
    # print (settings.MEDIA_ROOT)
    # print ()
    # print (os.path.dirname(os.path.realpath(__file__)))
    # print (settings.STATIC_URL)
    file_path = os.path.dirname(os.path.realpath(__file__)) +  '/static/CalPERS_Actuarial_Report_Data_01232018.csv'
    print (file_path)
    # print (file_path, 'os path', os.path)
    # workbook = xlrd.open_workbook(file_path)
    # sheet = workbook.sheet_by_name('AgencyTotals')

    # for row_index in range(sheet.nrows):
    #     if sheet.cell(row_index, 0).value == 'CITY OF RICHMOND':
    #         chart_data.append(['2017-18',sheet.cell(row_index, 9).value])
    #         chart_data.append(['2018-19',sheet.cell(row_index, 10).value])
    #         chart_data.append(['2019-20',sheet.cell(row_index, 11).value])
    #         chart_data.append(['2020-21',sheet.cell(row_index, 12).value])
    #         chart_data.append(['2021-22',sheet.cell(row_index, 13).value])
    #         chart_data.append(['2022-23',sheet.cell(row_index, 14).value])
    #         chart_data.append(['2023-24',sheet.cell(row_index, 15).value])
    #         chart_data.append(['2024-25',sheet.cell(row_index, 16).value])
    #         break;
    #
    # print (chart_data)

    # Fetch the data from csv

    projections = []
    unfunded_liabilities = []
    others = []


    with open(file_path) as input_file:
        reader = csv.reader(input_file, delimiter='\t')
        print ('name in view is ', name)
        for i,row in enumerate(reader):
            if row[0] == name:
                projections.append(['2017-18',toNumber(row[9])])
                projections.append(['2018-19',toNumber(row[10])])
                projections.append(['2019-20',toNumber(row[11])])
                projections.append(['2020-21',toNumber(row[12])])
                projections.append(['2021-22',toNumber(row[13])])
                projections.append(['2022-23',toNumber(row[14])])
                projections.append(['2023-24',toNumber(row[15])])
                projections.append(['2024-25',toNumber(row[16])])

                unfunded_liabilities = [toNumber(row[8]),0]
                others = [toNumber(row[7]),toNumber(row[6])]


        chart_data = {'projections':projections, 'unfunded_liabilities': unfunded_liabilities, 'others': others}
        print (chart_data)

    return JsonResponse(chart_data, safe=False)

def get_entities(request):
    entity_string = ""
    file_path = os.path.dirname(os.path.realpath(__file__)) +  '/static/CalPERS_Actuarial_Report_Data_01232018.csv'
    with open(file_path) as input_file:
        reader = csv.reader(input_file, delimiter='\t')
        for i,row in enumerate(reader):
                if i==0:
                    print (row)
                    continue

                if i != 1:
                    entity_string += ","
                entity_string += "\'" + row[0] + "\'"


    return JsonResponse(entity_string, safe=False)
