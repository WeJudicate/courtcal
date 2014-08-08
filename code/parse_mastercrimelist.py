# -*- coding: utf-8 -*-
# <nbformat>3.0</nbformat>

# <codecell>

import xlrd

def worksheet_to_list_of_dicts( worksheet ):
    list_of_dicts = []
    data = [] #make a data store
    for i in xrange(worksheet.nrows):
        data.append(worksheet.row_values(i))
    
    header = data[0]

    for i in data[1:]:
        x = dict( zip( header, i ) )
    
        list_of_dicts.append( x )
    return list_of_dicts

def get_seriousness_levels( convictions ):
    seriousness_levels = []
    for i in convictions:
        x = i['Offense Seriousness Level']
        if '(' in str( x ):
            level = int( x[1] )
        else:
            level = int( x )
            
        seriousness_levels.append( level )
        
    return seriousness_levels
    

# <codecell>

workbook = xlrd.open_workbook('../data/mastercrimelist.xls' )
print workbook.sheet_names()
by_title_worksheet = workbook.sheet_by_name('By Title')
by_mgl_worksheet = workbook.sheet_by_name('By MGL')

# <codecell>

by_mgl_list_of_dicts = worksheet_to_list_of_dicts( by_mgl_worksheet )
by_title_list_of_dicts = worksheet_to_list_of_dicts( by_title_worksheet )

offense_list_of_dicts = by_title_list_of_dicts
print offense_list_of_dicts[0]

# <codecell>

import json
x = json.dumps( offense_list_of_dicts )

with open( '../../courtcal/data/offense_list.json', 'w' ) as f:
    f.write( x )

# <codecell>

# generate 1000 criminal records

import random

random_convictions_database = []

for i in range( 1000 ):

    num_convictions = random.randint( 0, 10 )
    #print num_convictions
    conviction_indices = random.sample(range(len( offense_list_of_dicts )), num_convictions)
    convictions = []

    for idx in conviction_indices:
        convictions.append( offense_list_of_dicts[idx] )
    
    random_convictions_database.append( convictions )
    

# <codecell>

print [ len(i) for i in random_convictions_database ]

# <markdowncell>

# # Criminal History Groups Massachusetts Sentencing Guidelines
# 
# E 
# 
# • Serious Violent Record
# • Two or more prior convictions in any combination for offenses in level 7 through 9
# 
# D 
# 
# • Violent or Repetitive Record
# • Six or more prior convictions in any combination for offenses in levels three, four, five, or six; or
# • Two or more prior convictions in any combination for offenses in levels five or six; or
# • One prior conviction for offenses in levels seven through nine.
# 
# C 
# 
# • Serious Record
# • Three to five prior convictions in any combination for offenses in levels three or four; or
# • One prior conviction for offenses in levels five or six.
# 
# B
# 
# • Moderate Record
# • Six or more prior convictions in any combination for offenses in levels one or two; or
# • One or two prior convictions in any combination for offenses levels three or four.
# 
# A
# 
# • No/Minor Record
# • No prior convictions of any kind; or
# • One to five prior convictions in any combination for offenses in levels one or two.

# <codecell>

# LOGIC
import collections

all_convictions = random_convictions_database[:10]
for test_convictions in all_convictions:
    seriousness_levels = get_seriousness_levels( test_convictions )

    conviction_counts = collections.Counter( seriousness_levels )
    to_print = zip( seriousness_levels, [ i['Offense'] for i in test_convictions ] )
    print "Number of Crimes:", len( test_convictions )
    print "Crimes:"
    for i in to_print:
        print i
    print conviction_counts

    criminal_history_group = None

    # E
    if conviction_counts[7] + conviction_counts[8] + conviction_counts[9] >= 2:
        criminal_history_group = "E"

    # D 
    elif conviction_counts[7] + conviction_counts[8] + conviction_counts[9] >= 1:
        criminal_history_group = "D"    
    elif conviction_counts[5] + conviction_counts[6] >= 2:
        criminal_history_group = "D"
    elif conviction_counts[3] + conviction_counts[4] + conviction_counts[5] + conviction_counts[6] >= 6:
        criminal_history_group = "D"

    # C
    elif conviction_counts[5] + conviction_counts[6] >= 1:
        criminal_history_group = "C"
    elif conviction_counts[3] + conviction_counts[4] >= 3:
        criminal_history_group = "C"

    # B
    elif conviction_counts[3] + conviction_counts[4] >= 1:
        criminal_history_group = "C"
    elif conviction_counts[1] + conviction_counts[2] >= 6:
        criminal_history_group = "C"


    # A
    elif conviction_counts[1] + conviction_counts[2] >= 1:
        criminal_history_group = "A"
    elif len( convictions ) == 0:
        criminal_history_group = "A"


    
    print "Criminal History Group:", criminal_history_group
    print "\n"

