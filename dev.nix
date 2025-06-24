# dev.nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_18
    pkgs.yarn
    pkgs.firebase-tools
    pkgs.git
    pkgs.tailwindcss
    pkgs.eslint
    pkgs.prettier
  ];

  shellHook = ''
    echo "🔧 Dev environment loaded for EchoMe UI"
  '';
}
