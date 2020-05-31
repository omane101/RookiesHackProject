#!/usr/env python3
def generate_timestamp(year=2020,month=4,day=15,hour=12,minute=30):
	from random import randint;
	date_time="";
	month+=randint(-3,1)
	day+=randint(14,14)
	hour+=randint(-12,11)
	minute+=randint(0,30)
	second+=randint(0,60)
	return "{:02}-{:02}-{:02} {:02}:{:02:}:{:02}".format(year,month,day,hour,minute,second);
	
def main():
	line_split=""
	output=""
	join_str="";
	fake_time_stamp=""
	import re
	with open("ds-2_normalized.csv","r") as fr, open("ds-2_normalized.csv", "w") as fw:
		for line in fr:
			line=line.rstrip();
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
			fake_time_stamp=generate_time_stamp(2020,5);
			fw.write(fake_time_stamp+" "+join_str.join(line_split)+"\n")


if __name_ == "__main__"
	main()
