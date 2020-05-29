#!/usr/env python3
line_split=""
output=""
join_str="";
import re
with open("ds-2_normalized.csv","r") as fr, open("deaths_cleaned_up.tsv", "w") as fw:
	for line in fr:
		try:
			line.index('."')
			line_split=line.split('.",',1)
			join_str='."\t';
		except:
			line_split=line.split(".,",1)
			join_str=".\t"
		
		if(len(line_split) == 1):
			print(line);

		line_split[1]=line_split[1].replace(",","\t");
		line_split[0]=line_split[0]
		fw.write(join_str.join(line_split))
