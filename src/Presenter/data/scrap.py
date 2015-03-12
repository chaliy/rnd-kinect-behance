# coding=utf-8
import requests
from bs4 import BeautifulSoup
import os
import json
import shutil

def read_project(id):
    r = requests.get('http://www.behance.net/v2/projects/' + id + '?api_key=1F254TDvSbzSKBpTXB4aTnlW5LNdD5CK')
    #r.encoding = 'utf-8'
    return r.json()

def dump_project(project):
  project_id = str(project['id'])

  if not os.path.exists(project_id):
    os.mkdir(project_id)

  project_file_name = project_id + '\\project.json'
  write_text(project_file_name, json.dumps(project, sort_keys=True, indent=4))

def module_image_src(module):
  if module['sizes']:
    return module['sizes']['original']
  else:
    return module['src']

def dump_images(project):
  project_id = str(project['id'])
  modules = project['modules']
  for module in modules:
    if module['type'] == 'image':
      module_id = str(module['id'])
      img_url = module_image_src(module)
      img_resp = requests.get(img_url, stream=True)
      img_resp.raw.decode_content = True
      img_content_type = img_resp.headers['Content-Type']
      ext = {
        'image/png': 'png',
        'image/gif': 'gif',
        }.get(img_content_type, 'jpg')

      image_file_name = project_id + '\\' + module_id + '.' + ext
      print('<> ' + image_file_name);
      with open(image_file_name, 'wb') as f:
        shutil.copyfileobj(img_resp.raw, f)

def write_text(file_name, content):
  print('< ' + file_name);
  with open(file_name, 'w') as f:
      f.write(content)


def write_project_html(project):
  project_id = str(project['id'])
  modules = project['modules']
  html = ''
  html += '﻿<div class="project-styles hd_images_enabled" id="primary-project-content">\n'
  html += '    <ul class="editor-modules-version-4" id="project-modules" style="background-color: transparent;">\n'

  for module in modules:
    if module['type'] == 'image':
      module_id = str(module['id'])
      img_ext = module_image_src(module)[-3:]
      html += '     <li class="module image"><img width="' + str(module['width']) + '" height="' + str(module['height']) + '" src="' + module_id + '.' + str(img_ext) + '" ><div class="spacer"><div class="divider thin" style="top: 50%;"></div></div></li>\n'
    elif module['type'] == 'text':
      html += '     <li class="module text"><div class="text-center"><div class="main-text">' + str(module['text'].encode('utf-8')) + '</div></div><div class="spacer"><div class="divider thin" style="top: 50%;"></div></div></li>\n'
  html += '    </ul>\n'
  html += '</div>\n'

  # styles
  html += '<style type="text/css">\n'
  html += 'ul li { list-style: none; margin: 0px; padding: 0px; }\n'
  html += '.spacer {height: 0px;}\n'
  html += '.divider {display: none;}\n'
  html += '#primary-project-content {\n'
  if project['styles']:
    styles = project['styles']
    if styles['background']:
      background = styles['background']
      html += '    width: 724px;\n'
      html += '    padding-top: 0px;\n'
      html += '    padding-left: 22px;\n'
      html += '    background-color: #' + str(background['color']) + ';\n'
      if 'image' in background.keys():
        bkg_image = background['image']
        html += '    background-image: url("' + str(bkg_image['url']) + '");\n'
        html += '    background-repeat: ' + str(bkg_image['repeat']) + ';\n'
        html += '    background-position: ' + str(bkg_image['position']) + ';\n'
  html += '}\n'
  html += '</style>\n'

  project_file_name = project_id + '\\project.html'
  write_text(project_file_name, html)

def scrap_project(id):

    project = read_project(id)['project']

    dump_project(project)
    dump_images(project)

    write_project_html(project)

# scrap_project('13331447')
scrap_project('17136289')
scrap_project('11894973')
scrap_project('18416995')
scrap_project('15313489')
scrap_project('89757')
scrap_project('98119')
scrap_project('94608')
scrap_project('2453715')
scrap_project('89909')
scrap_project('15628009')
scrap_project('15228809')
scrap_project('14573015')
scrap_project('15373141')
scrap_project('14350243')
scrap_project('15735307')
scrap_project('20940531')
scrap_project('16036635')
scrap_project('6886313')
scrap_project('20110033')
scrap_project('20761859')
scrap_project('20301049')
scrap_project('16525321')
scrap_project('20379627')
scrap_project('18422523')
scrap_project('10483331')
#scrap_project('13342265')
scrap_project('20854599')
scrap_project('144893')
scrap_project('21030195')
