from django.shortcuts import render
from django.http import JsonResponse
# from django.templatetags.static import static

import os
import csv
import json

def get_maps(request):
    return render(request, 'pd_maps/map.html')

def get_charts(request, name):
        return render(request, 'pd_maps/charts.html', {'chart_data': json.dumps(get_chart_data(name))})

def toNumber(str_num):
    return int(str_num.replace(',', ''))

def get_chart_data(name):
    file_path = os.path.dirname(os.path.realpath(__file__)) +  '/static/CalPERS_Actuarial_Report_Data_01232018_With_Best_and_Worst.csv'

    # Fetch the data from xlsx (still keeping this code around, just in case we need it in the future)
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


    # Fetch the data from csv

    projections = []
    unfunded_liabilities = []
    total_liabilities = []
    assets = []
    others = []
    best_cases = []
    worst_cases = []

    years = ['2017-18','2018-19', '2019-20', '2020-21', '2021-22', '2022-23', '2023-24','2024-25']

    with open(file_path) as input_file:
        # reader = csv.reader(input_file, delimiter='\t')
        reader = csv.reader(input_file)
        for i,row in enumerate(reader):
            if row[0] == name:
                for i in range(len(years)):
                    projections.append([years[i], toNumber(row[9+i])])
                    # equiv to:
                    # projections.append(['2017-18',toNumber(row[9])])
                    # projections.append(['2018-19',toNumber(row[10])])
                    # ..
                    if years[i] in ['2019-20', '2020-21', '2021-22', '2022-23']:
                        #best_cases.append([years[i],toNumber(row[16+i])])
                        best_cases.append([years[i],0])
                        worst_cases.append([years[i],toNumber(row[21+i])])
                    else:
                        best_cases.append([years[i],0])
                        worst_cases.append([years[i], 0])

                    unfunded_liabilities = [toNumber(row[8]),0]
                    total_liabilities = [toNumber(row[6]),0]
                    assets = [toNumber(row[7]),0]
                    funded_liabilities = [toNumber(row[7]),0]

                    others = [toNumber(row[7]),toNumber(row[6])]

        chart_data = {"name": name, "projections":projections, "best_cases": best_cases, "worst_cases":worst_cases, "unfunded_liabilities": unfunded_liabilities, "total_liabilities": total_liabilities, "assets": assets, "others": others}

    return chart_data
    # return JsonResponse(chart_data, safe=False)

# fetch the entities that we want to show on the map and use in the typeahead
def get_entities(request):
    # entity_string = ""
    entity_list = []
    file_path = os.path.dirname(os.path.realpath(__file__)) +  '/static/CalPERS_Actuarial_Report_Data_01232018.csv'
    with open(file_path) as input_file:
        # reader = csv.reader(input_file, delimiter='\t')
        reader = csv.reader(input_file)
        for i,row in enumerate(reader):
                if i==0 or row[0]=="":
                    continue
                # if i != 1:
                #     entity_string += ","
                # entity_string += "\'" + row[0] + "\'"
                entity_list.append(row[0])

    return JsonResponse(entity_list, safe=False)
