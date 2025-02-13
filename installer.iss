[Setup]
AppId=com.emr.app
AppName=EMR
AppVersion=1.0.0
DefaultDirName={autopf}\EMR
DefaultGroupName=EMR
OutputBaseFilename=emr-installer
Compression=lzma
SolidCompression=yes
SetupIconFile=frontend/edsols.ico  
WizardStyle=modern
OutputDir=outputbm
PrivilegesRequired=admin

[Files]
Source: "setup/win-unpacked\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs
Source: "/ffmpeg/*"; DestDir: "{app}\resources\ffmpeg"; Flags: recursesubdirs createallsubdirs
Source: "espeak-ng-X64.msi"; DestDir: "{tmp}"; Flags: ignoreversion

[Dirs]
Name: "{app}"; Permissions: users-full

[Icons]
Name: "{autodesktop}\EMR"; Filename: "{app}\emr.exe"
Name: "{group}\EMR"; Filename: "{app}\emr.exe"
Name: "{group}\Uninstall EMR"; Filename: "{uninstallexe}"

[Run]
Filename: "{tmp}\espeak-ng-X64.msi"; Parameters: "/quiet"; Flags: shellexec waituntilterminated; StatusMsg: "Installing eSpeak-ng..."
Filename: "cmd"; Parameters: "/c setx PATH ""%PATH%;{app}\resources\ffmpeg\bin"""; Flags: runhidden waituntilterminated; StatusMsg: "Adding FFmpeg to PATH..."
Filename: "{app}\emr.exe"; Flags: nowait postinstall skipifsilent

[Registry]
Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; ValueType: expandsz; ValueName: "Path"; ValueData: "{olddata};{app}\resources\ffmpeg\bin"

[Code]
const
  WM_SETTINGCHANGE = $1A;
  SMTO_ABORTIFHUNG = $0002;

function FindWindow(lpClassName: AnsiString; lpWindowName: AnsiString): Longint;
  external 'FindWindowA@user32.dll stdcall';

function SendMessageTimeout(hWnd: Longint; Msg: Longint; wParam: Longint; lParam: Longint;
  fuFlags: Longint; uTimeout: Longint; var lpdwResult: Longint): Longint;
  external 'SendMessageTimeoutA@user32.dll stdcall';

procedure RefreshEnvironment;
var
  hwnd: Longint;
  MsgResult: Longint;
begin
  hwnd := FindWindow('Progman', '');
  if hwnd = 0 then
    hwnd := FindWindow('Shell_TrayWnd', '');
  if hwnd <> 0 then
    SendMessageTimeout(hwnd, WM_SETTINGCHANGE, 0, 0, SMTO_ABORTIFHUNG, 5000, MsgResult);
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
  begin
    RefreshEnvironment;
  end;
end;
