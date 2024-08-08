"""
Simple file to build the pages so we can cache bust.
"""
import shutil
import os
import math


categoryFile = 'category.txt'
versionFile = 'version.txt'

def getFileContents(fileName):
    with open(fileName, 'r') as f:
        contents = f.read()
        return contents.strip()

def getFileLines(fileName):
    with open(fileName, 'r') as f:
        return f.readlines()

def getFileContentsWithDefault(fileName, default):
    try:
        return getFileContents(fileName)
    except:
        return default

def getCurrentCategoryAndVersion(primes):
    category = getFileContentsWithDefault(categoryFile, 'alpha')
    version = getFileContentsWithDefault(os.path.join(category, versionFile), '0')
    version = int(version)
    return (category, primes[version], version)

def writeNewVersion(category, index):
    if not os.path.exists(category):
        os.mkdir(category)
    index = index + 1
    with open (os.path.join(category, versionFile), 'w') as f:
        s = str(index)
        f.write(s)



def getAllFiles():
    exclusions = [
        '.gitignore',
        '.git',
        'LICENSE',
        'tools',
        'README.md'
    ]
    listedFiles = []
    listedDirs = []
    for root, dirs, files in os.walk('..'):
        for e in exclusions:
            if e in dirs:
                dirs.remove(e)
            if e in files:
                files.remove(e)
        for d in dirs:
            absPath = os.path.join(root, d)
            listedDirs.append(absPath)
        for f in files:
            absPath = os.path.join(root, f)
            listedFiles.append(absPath)
    return listedFiles, listedDirs

def makeNewName(name, category, version):
    root, ext = os.path.splitext(name)
    return f'{root}_{category}_{version}{ext}'

def makeNewFileName(name, jsFileNames, category, version):
    paths = name.split(os.sep)
    newPaths = []
    for p in paths:
        if p == '..':
            newPaths.append(p)
            newPaths.append('fbuild')
        elif p in jsFileNames:
            newPaths.append(makeNewName(p, category, version))
        else:
            newPaths.append(p)
    return os.path.join(*newPaths)
        
def copyFile(name, jsFileNames, category, version, straightCopy):
    newName = makeNewFileName(name, jsFileNames, category, version)
    if straightCopy:
        shutil.copyfile(name, newName)
    else:
        lines = getFileLines(name)
        with open(newName, 'w') as f:
            for l in lines:
                if l.find('from') != -1:
                    for js in jsFileNames:
                        l = l.replace(js, makeNewName(js, category, version))
                elif l.find('%category x%') != -1:
                    l = l.replace('%category x%', f'{category} {version}')
            
                f.write(l)
    print (f'Copied {name} to {newName}')

    

# Build primes, because primes are our version number. :)
primes = []
primes.append(2)
primes.append(3)


while (len(primes) < 50000):
    candidate = primes[-1] + 2
    sqc = math.sqrt(candidate)
    flag = True
    while (flag):
        for prime in primes:
            if prime > sqc:
                primes.append(candidate)
                flag = False
                break
            elif candidate % prime == 0:
                candidate += 2
                sqc = math.sqrt(candidate)
                break

# Completely remove the build folder
try:
    shutil.rmtree(os.path.join('..','fbuild'))
except:
    pass

# get the current category and version
category, version, index = getCurrentCategoryAndVersion(primes)

#get all the files to copy
files, dirs = getAllFiles()

#get the js file names
jsFileNames = []
for f in files:
    name = os.path.split(f)[-1]
    root, ext = os.path.splitext(name)
    if ext == '.js':
        jsFileNames.append(name)

# build the directory structure
os.mkdir('../fbuild')
for d in dirs:
    newDirName = makeNewFileName(d, [], category, version)
    os.mkdir(newDirName)

# copy the files
copyOnly = [
    os.path.join('..','favicon.ico')
]
for f in files:
    try:
        copyFile(f, jsFileNames, category, version, f in copyOnly)
    except Exception as e:
        print(f'Failed to copy {f}:',e)

#update the version
writeNewVersion(category, index)






