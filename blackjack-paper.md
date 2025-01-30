\documentclass{article}
\usepackage{amsmath}
\usepackage{amsthm}
\usepackage{graphicx}
\usepackage{hyperref}

\title{On the Probabilistic Framework of Multi-Deck Blackjack Systems}
\author{Theoretical Gaming Division}
\date{\today}

\begin{document}
\maketitle

\begin{abstract}
This paper presents a mathematical analysis of multi-deck blackjack systems, focusing on the probability spaces and optimization strategies in computerized implementations. We develop a formal framework for understanding card value distributions, deck depletion effects, and decision optimization under uncertainty. Our analysis demonstrates how the introduction of multiple decks creates a dynamic probability space that evolves with each card drawn, leading to complex strategic considerations in both human and computerized play.
\end{abstract}

\section{Introduction}
Blackjack, while seemingly simple in its ruleset, presents a rich mathematical structure when analyzed through the lens of probability theory and game theory. This paper examines the mathematical underpinnings of a multi-deck blackjack system, with particular attention to its implementation in computational environments.

\section{Mathematical Framework}
\subsection{Card Value Functions}
We define the fundamental card value function $V(c)$ for any card $c$ as:

\[
V(c) = \begin{cases}
c & \text{if } c \in \{2,3,\ldots,10\} \\
10 & \text{if } c \in \{J,Q,K\} \\
\{1,11\} & \text{if } c = A
\end{cases}
\]

\subsection{Probability Space}
For a system with $n$ decks, our sample space $\Omega$ has cardinality:
\[
|\Omega| = 52n
\]

The initial probability of drawing any specific card value $v$ is:
\[
P(v) = \frac{4n}{52n} = \frac{4}{52}
\]

\section{Dynamic Probability Analysis}
\subsection{Ace Optimization}
We define an ace optimization function $A(H)$ for hand total $H$:
\[
A(H) = \begin{cases}
11 & \text{if } H + 11 \leq 21 \\
1 & \text{otherwise}
\end{cases}
\]

\subsection{Bust Probability}
For a current hand total $t$ and deck state $D$:
\[
P(\text{bust}|t,D) = \frac{\sum_{x > 21-t} \text{remaining cards with value }x}{\text{total remaining cards in }D}
\]

\section{Strategic Optimization}
\subsection{Expected Value}
The expected value of the next card, given deck state $D$:
\[
E[V_{\text{next}}|D] = \sum_{v \in \text{values}} v \cdot \frac{\text{remaining cards with value }v}{\text{total remaining cards}}
\]

\subsection{Dealer Strategy}
The dealer's strategy function $S_d$ follows:
\[
S_d(t) = \begin{cases}
\text{hit} & \text{if } t < 17 \\
\text{stand} & \text{if } t \geq 17
\end{cases}
\]

\section{Implementation Considerations}
\subsection{RNG Properties}
The random number generator must ensure:
\[
P(\text{draw}_i = c|D) = \frac{1}{|D|}
\]

This creates an ergodic Markov chain where:
\[
\lim_{n \to \infty} P(D_n) = \frac{1}{|\Omega|}
\]

\section{Conclusion}
The mathematical complexity of multi-deck blackjack emerges from the interaction of:
\begin{enumerate}
\item Dynamic probability spaces
\item Conditional ace values
\item Fixed dealer strategies
\item Deck depletion effects
\end{enumerate}

These interactions create a rich mathematical framework for analyzing both human and computerized play strategies.

\begin{thebibliography}{9}
\bibitem{griffin1999theory}
Griffin, P. A. (1999). The theory of blackjack: The compleat card counter's guide to the casino game of 21. Huntington Press.

\bibitem{thorp1966beat}
Thorp, E. O. (1966). Beat the dealer: A winning strategy for the game of twenty-one. Vintage.
\end{thebibliography}

\end{document}